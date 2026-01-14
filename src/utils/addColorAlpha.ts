/**
 * Take a CSS color string (hex, rgb, or hsl) and an alpha value (0 to 1) and returns a new color string with the alpha added
 *
 * @example addColorAlpha("#ff0000", 0.5) -> "rgba(255, 0, 0, 0.5)"
 */
export function addColorAlpha(color: string, alpha: number) {
  // Hex color
  if (color.startsWith('#')) {
    const r = Number.parseInt(color.slice(1, 3), 16);
    const g = Number.parseInt(color.slice(3, 5), 16);
    const b = Number.parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Rgb color
  if (color.startsWith('rgb')) {
    const parts = color.split(',').map(part => part.replaceAll(/[()]/g, ''));
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }

  // hsl color
  if (color.startsWith('hsl')) {
    const parts = color.split(',').map(part => part.replaceAll(/[()]/g, ''));
    return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }

  return color;
}
