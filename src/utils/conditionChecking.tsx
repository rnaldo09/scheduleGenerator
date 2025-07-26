import { parseTime } from "./timeUtils";

export const matchesCondition = (conditions: string[], day: string, time: number): boolean => {
  for (const condition of conditions) {
    const [condDay, op, value] = condition.split("|");
    if (condDay !== day) continue;

    if (op === "=") {
      if (value === "morning" && !(time >= 420 && time < 720)) return false;
      else if (value === "afternoon" && !(time >= 720)) return false;
      else if (!["morning", "afternoon"].includes(value) && parseTime(value) !== time) return false;
    } else if (op === "!=") {
      if (!["morning", "afternoon"].includes(value) && parseTime(value) === time) return false;
    }
  }
  return true;
};

export const isSlotValid = (conditions: string[], day: string, timeStr: string) => {
  const toMinutes = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const timeInMinutes = toMinutes(timeStr);

  for (const cond of conditions) {
    const [condDay, operator, value] = cond.split("|");
    if (condDay !== day) continue;

    const valueMinutes = toMinutes(value);

    switch (operator) {
      case "!=":
        if (timeInMinutes === valueMinutes) return false;
        break;
      case "=":
        if (timeInMinutes !== valueMinutes) return false;
        break;
      case "<":
        if (!(timeInMinutes < valueMinutes)) return false;
        break;
      case ">":
        if (!(timeInMinutes > valueMinutes)) return false;
        break;
      case "<=":
        if (!(timeInMinutes <= valueMinutes)) return false;
        break;
      case ">=":
        if (!(timeInMinutes >= valueMinutes)) return false;
        break;
      default:
        console.warn(`Unsupported operator: ${operator}`);
        break;
    }
  }

  return true;
};