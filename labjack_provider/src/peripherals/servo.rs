
pub struct Servo {
    pub name: String,
    pub min_pulse: u16,
    pub max_pulse: u16,
    pub frequency: u32,
    pub roll_value: u32,
    pub config_a: u32,
    pub angle: f32, 
}

impl Servo {
    pub fn new(name: &str, min_pulse: u16, max_pulse: u16, frequency: u32, roll_value: u32, config_a: u32) -> Servo {
        Servo {
            name: name.to_string(),
            min_pulse,
            max_pulse,
            frequency,
            roll_value,
            config_a,
            angle: 0.0,
        }
    }
    pub fn write_angle(&mut self, angle: f32) {
    }
    pub fn read_angle(&mut self) -> f32 {
        0.0
    }
}