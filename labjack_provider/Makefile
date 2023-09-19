CXX = g++
CXXFLAGS = -std=c++11 -Isrc/peripherals -Isrc/utils/C_C++_LJM
LDFLAGS = -L/usr/local/lib
LDLIBS = -lLabJackM

SRC_DIR = src
BUILD_DIR = build
PERIPHERALS_DIR = $(SRC_DIR)/peripherals
UTILS_DIR = $(SRC_DIR)/utils/C_C++_LJM

SRC_FILES = $(wildcard $(SRC_DIR)/*.cpp)
PERIPHERALS_FILES = $(wildcard $(PERIPHERALS_DIR)/*.cpp)
UTILS_FILES = $(wildcard $(UTILS_DIR)/*.c)

OBJ_DIR = $(BUILD_DIR)/obj
OBJ_FILES = $(patsubst $(SRC_DIR)/%.cpp,$(OBJ_DIR)/%.o,$(SRC_FILES)) \
            $(patsubst $(PERIPHERALS_DIR)/%.cpp,$(OBJ_DIR)/%.o,$(PERIPHERALS_FILES)) \
            $(patsubst $(UTILS_DIR)/%.c,$(OBJ_DIR)/%.o,$(UTILS_FILES))
OUT_DIR = $(BUILD_DIR)/bin
OUT = $(OUT_DIR)/myprogram

all: $(OUT)

$(OUT): $(OBJ_FILES)
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $^ -o $@ $(LDLIBS)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR)/%.o: $(PERIPHERALS_DIR)/%.cpp
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR)/%.o: $(UTILS_DIR)/%.c
	@mkdir -p $(@D)
	$(CC) -c $< -o $@

clean:
	rm -rf $(BUILD_DIR)