export async function getPluginApiHtml(name: string, isIndex: boolean) {
  return `<em>plugin api: ${name}, index: ${isIndex}</em>`;
}
