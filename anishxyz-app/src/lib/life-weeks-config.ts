import fs from "node:fs"
import path from "node:path"
import YAML from "yaml"
import type { LifeWeeksConfig } from "@/lib/life-weeks"

const CONFIG_PATH = path.join(process.cwd(), "src", "content", "life-weeks.yaml")

export function loadLifeWeeksConfig(): LifeWeeksConfig {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8")
  return YAML.parse(raw) as LifeWeeksConfig
}
