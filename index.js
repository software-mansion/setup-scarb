const core = require("@actions/core");

async function run() {
  try {
    core.info("hello world");
  } catch (e) {
    core.setFailed(e);
  }
}

void run();
