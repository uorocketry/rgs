import os
import subprocess
import time
import threading
from collections import deque
from typing import Dict, Deque, List, Optional

from textual.app import App, ComposeResult
from textual.containers import Horizontal, Vertical
from textual.widgets import Header, Footer, TabbedContent, TabPane, RichLog, Label
from textual.reactive import reactive
from textual import work, log
from textual.message import Message

import sys

def find_ftdi_device(vendor_id="0403", product_id="6001") -> Optional[str]:
    """
    Scan /sys/bus/usb/devices for a device with the given vendor and product id,
    and return the corresponding /dev/ttyUSB* device path if found.
    """
    import glob

    # Find all ttyUSB* devices
    usb_devs = glob.glob("/dev/ttyUSB*")
    for dev in usb_devs:
        # Resolve symlink to get the device path in /sys
        try:
            # /sys/class/tty/ttyUSB0/device/../idVendor
            tty_name = os.path.basename(dev)
            sys_tty_path = f"/sys/class/tty/{tty_name}/device"
            # Walk up to the USB device node
            sys_usb_path = os.path.realpath(sys_tty_path)
            # Sometimes need to go up one more for idVendor/idProduct
            for _ in range(3):
                id_vendor_path = os.path.join(sys_usb_path, "idVendor")
                id_product_path = os.path.join(sys_usb_path, "idProduct")
                if os.path.exists(id_vendor_path) and os.path.exists(id_product_path):
                    with open(id_vendor_path) as f:
                        vid = f.read().strip().lower()
                    with open(id_product_path) as f:
                        pid = f.read().strip().lower()
                    if vid == vendor_id.lower() and pid == product_id.lower():
                        return dev
                # Go up one directory
                sys_usb_path = os.path.dirname(sys_usb_path)
        except Exception:
            continue
    return None

class UpdateMessage(Message):
    """Message to update UI from the background worker."""

    def __init__(
        self,
        message_type: str,
        data: List[str],
        timestamp: str,
        log_text: str,
    ):
        super().__init__()
        self.message_type = message_type
        self.data = data
        self.timestamp = timestamp
        self.log_text = log_text


class EllipseReaderApp(App):
    """A Textual application to monitor SBG Ellipse sensor data with per-type tabs."""

    CSS = """
    Screen {
        layout: vertical;
    }

    #status-bar {
        layout: horizontal;
        height: auto;
        background: $surface;
        dock: top;
        padding: 0 1;
    }

    .status-label {
        margin: 1 1 0 1;
    }

    #connection-status {
        margin-top: 1;
        color: $warning;
        text-style: bold;
    }

    #connection-status.connected {
        color: $success;
    }

    #connection-status.error {
        color: $error;
    }
    """

    BINDINGS = [
        ("d", "clear_active_data", "Clear Data"),
        ("q", "quit", "Quit"),
    ]

    connection_status = reactive("Awaiting Data...")
    last_utc_time = reactive("N/A")

    def __init__(self):
        super().__init__()
        self.running = threading.Event()
        self.max_messages = 10  # Maximum messages per type
        self.message_queues: Dict[str, Deque[str]] = {}  # Capped queues per message type

    def compose(self) -> ComposeResult:
        yield Header()
        with Vertical(id="main-content"):
            with Horizontal(id="status-bar"):
                yield Label("Status:", classes="status-label")
                yield Label(self.connection_status, id="connection-status")
                yield Label("Last UTC Time:", classes="status-label")
                yield Label(self.last_utc_time, id="utc-time-display")
            yield TabbedContent(id="message-tabs")
        yield Footer()

    def on_mount(self) -> None:
        self.running.set()
        self.read_from_device()

    def on_unmount(self) -> None:
        self.running.clear()

    def action_clear_active_data(self) -> None:
        tabs = self.query_one(TabbedContent)
        if tabs.active:
            pane = tabs.get_pane(tabs.active)
            pane.query_one(RichLog).clear()

    def on_update_message(self, message: UpdateMessage) -> None:
        """Handle UI updates with capped per-type queues."""
        try:
            # Append to queue for this message type
            queue = self.message_queues.setdefault(
                message.message_type, deque(maxlen=self.max_messages)
            )
            queue.append(message.log_text)

            # Update connection status once
            if self.connection_status != "Connected":
                self.connection_status = "Connected"
                self._update_connection_label("Connected")

            # Create tab if missing
            tabs = self.query_one(TabbedContent)
            if not any(p.id == message.message_type for p in tabs.query(TabPane)):
                pane = TabPane(message.message_type, id=message.message_type)
                pane.compose_add_child(
                    RichLog(wrap=True, highlight=False, auto_scroll=True)
                )
                tabs.add_pane(pane)
                if not tabs.active:
                    tabs.active = message.message_type

            # Refresh only this tab
            self._update_tab_display(message.message_type)

        except Exception as e:
            log(f"Error in on_update_message: {e}")

    def _update_tab_display(self, category: str) -> None:
        """Update a specific tab's log based on its deque."""
        try:
            tabs = self.query_one(TabbedContent)
            pane = next((p for p in tabs.query(TabPane) if p.id == category), None)
            if not pane:
                return
            log_widget = pane.query_one(RichLog)
            log_widget.clear()
            for entry in self.message_queues.get(category, []):
                log_widget.write(entry)
        except Exception:
            pass

    def _update_connection_label(self, status: str) -> None:
        """Update the connection status styling."""
        try:
            widget = self.query_one("#connection-status", Label)
            widget.update(status)
            widget.remove_class("connected", "error")
            if status == "Connected":
                widget.add_class("connected")
            else:
                widget.add_class("error")
        except:
            pass

    def update_utc_time(self, time_str: str) -> None:
        try:
            self.query_one("#utc-time-display", Label).update(time_str)
        except:
            pass

    def parse_line(self, line: str) -> None:
        if not line or line.startswith("*"):
            return
        parts = line.strip().split()
        if not parts:
            return
        message_type = parts[0].rstrip(":")
        data = parts[1:]
        log_text = line

        if message_type == "utcTime":
            try:
                time_str = (
                    f"{parts[3]}-{parts[4].zfill(2)}-{parts[5].zfill(2)} "
                    f"{parts[6].zfill(2)}:{parts[7].zfill(2)}:{parts[8].zfill(2)}"
                )
                self.last_utc_time = time_str
                self.update_utc_time(time_str)
            except IndexError:
                pass

        timestamp = (
            self.last_utc_time
            if self.last_utc_time != "N/A"
            else time.strftime("%H:%M:%S")
        )
        self.post_message(UpdateMessage(message_type, data, timestamp, log_text))

    @work(thread=True)
    def read_from_device(self) -> None:
        try:
            # Find FTDI USB device by vendor/product id
            dev_path = find_ftdi_device("0403", "6001")
            if not dev_path:
                err = "Error: FTDI USB device (0403:6001) not found"
                self.connection_status = err
                self._update_connection_label(err)
                return

            if not os.path.exists("./sbgBasicLogger"):
                err = "Error: sbgBasicLogger executable not found"
                self.connection_status = err
                self._update_connection_label(err)
                return

            cmd = [
                "stdbuf", "-oL", "./sbgBasicLogger",
                "-s", dev_path, "-r", "115200", "-p"
            ]
            proc = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                text=True, bufsize=1
            )

            time.sleep(1)
            if proc.poll() is not None:
                err_out = proc.stderr.read().strip()
                err = f"sbgBasicLogger failed: {err_out}"
                self.connection_status = err
                self._update_connection_label(err)
                return

            self.connection_status = "Connected"
            self._update_connection_label("Connected")

            if proc.stdout:
                for line in iter(proc.stdout.readline, ""):
                    if not self.running.is_set():
                        break
                    if line.strip():
                        self.parse_line(line)

        except FileNotFoundError:
            err = "Error: stdbuf or sbgBasicLogger not found"
            self.connection_status = err
            self._update_connection_label(err)
        except Exception as e:
            err = f"Error: {e}"
            self.connection_status = err
            self._update_connection_label(err)


if __name__ == "__main__":
    app = EllipseReaderApp()
    app.run()
