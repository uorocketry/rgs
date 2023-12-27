// fn main() {
//     let dst = cmake::build("labjack").join("build");

//     println!("cargo:rustc-link-search={}", dst.display());
//     println!("cargo:rustc-link-lib=static=labjack");

//     println!("cargo:rerun-if-changed=wrapper.h");
//     println!("cargo:rerun-if-changed=labjack");
// }

extern crate cc;
extern crate bindgen;

use std::env;
use std::path::PathBuf;

fn main() {
    // Compile the C library
    // cc::Build::new()
    //     .file("path/to/your/c/file.c")
    //     .compile("your_c_library");

    // Generate bindings
    let bindings = bindgen::Builder::default()
        .header("wrapper.h")
        .generate()
        .expect("Unable to generate bindings");

    // Write the bindings to the $OUT_DIR/bindings.rs file.
    let out_path = PathBuf::from(env::var("").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"));

    println!("cargo:rerun-if-changed=wrapper.h");

}