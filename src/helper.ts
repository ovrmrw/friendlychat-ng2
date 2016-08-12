export function logger(groupName: string, ...logs: any[]) {
  console.group(groupName);
  logs.forEach(log => console.log(log));
  console.groupEnd();
}