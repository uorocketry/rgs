use crate::commands::MenuItem;
use crate::messages::display::SentMessage;
use messages_prost::common::Node;
use ratatui::layout::{Constraint, Direction, Layout, Rect};
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{Block, Borders, List, ListItem, Paragraph};

pub struct AppState {
    pub selected: usize,
    pub left_log_lines: Vec<String>,
    pub right_sent_messages: Vec<SentMessage>,
    pub right_received_messages: Vec<SentMessage>,
    pub ping_counter: u32,
    pub origin_node: i32,
    pub target_node: i32,
}

impl AppState {
    pub fn new(origin_node: i32, target_node: i32) -> Self {
        Self {
            selected: 0,
            left_log_lines: Vec::new(),
            right_sent_messages: Vec::new(),
            right_received_messages: Vec::new(),
            ping_counter: 0,
            origin_node,
            target_node,
        }
    }
}

pub fn draw(f: &mut ratatui::Frame, state: &AppState) {
    let root = Layout::default()
        .direction(Direction::Vertical)
        .constraints(
            [
                Constraint::Length(3),
                Constraint::Min(8),
                Constraint::Length(3),
            ]
            .as_ref(),
        )
        .split(f.size());

    let help = Paragraph::new("↑/↓ select, Enter send, q quit | n/p change target/origin node")
        .block(
            Block::default()
                .title("manual-command-dispatcher")
                .borders(Borders::ALL),
        );
    f.render_widget(help, root[0]);

    let halves = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        .split(root[1]);

    // Left: command list
    let items: Vec<ListItem> = MenuItem::all()
        .iter()
        .enumerate()
        .map(|(i, item)| {
            let sel = i == state.selected;
            let content = if sel {
                Span::styled(item.label(), Style::default().add_modifier(Modifier::BOLD))
            } else {
                Span::raw(item.label())
            };
            ListItem::new(Line::from(content))
        })
        .collect();
    let list = List::new(items).block(Block::default().title("Commands").borders(Borders::ALL));
    f.render_widget(list, halves[0]);

    // Right: latest sent messages
    // Right is vertically split into Sent (top) and Received (bottom)
    let right_split = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        .split(halves[1]);

    let right_sent_lines: Vec<Line> = state
        .right_sent_messages
        .iter()
        .rev()
        .take(10)
        .rev()
        .map(|m| Line::from(Span::raw(m.summary.clone())))
        .collect();
    let right_sent = Paragraph::new(right_sent_lines)
        .block(Block::default().title("Latest Sent").borders(Borders::ALL));
    f.render_widget(right_sent, right_split[0]);

    let right_recv_lines: Vec<Line> = state
        .right_received_messages
        .iter()
        .rev()
        .take(10)
        .rev()
        .map(|m| Line::from(Span::raw(m.summary.clone())))
        .collect();
    let right_recv = Paragraph::new(right_recv_lines).block(
        Block::default()
            .title("Latest Received")
            .borders(Borders::ALL),
    );
    f.render_widget(right_recv, right_split[1]);

    // Footer: status
    let mut footer: Vec<Line> = Vec::new();
    footer.push(Line::from(Span::raw(format!(
        "Origin: {:?}  Target: {:?}",
        Node::try_from(state.origin_node).unwrap_or(Node::Unspecified),
        Node::try_from(state.target_node).unwrap_or(Node::Unspecified)
    ))));
    let log_text: String = state
        .left_log_lines
        .iter()
        .rev()
        .take(2)
        .rev()
        .cloned()
        .collect::<Vec<_>>()
        .join("\n");
    footer.push(Line::from(Span::raw(log_text)));
    let footer =
        Paragraph::new(footer).block(Block::default().title("Status").borders(Borders::ALL));
    f.render_widget(footer, root[2]);
}
