// Adapted traversal/merge semantics from Gabriele Cirulli's 2048 (MIT).
// Upstream provenance and full copyright notice: public/licenses/2048.txt.
export type Direction = "up" | "right" | "down" | "left";
export function mergeLine(line: number[]): { line: number[]; score: number } {
  const values = line.filter(Boolean);
  const output: number[] = [];
  let score = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i] === values[i + 1]) {
      const value = values[i]! * 2;
      output.push(value);
      score += value;
      i++;
    } else output.push(values[i]!);
  }
  while (output.length < line.length) output.push(0);
  return { line: output, score };
}
export function move(board: number[], direction: Direction) {
  const output = [...board];
  let score = 0;
  for (let i = 0; i < 4; i++) {
    const indices = Array.from({ length: 4 }, (_, n) =>
      direction === "left"
        ? i * 4 + n
        : direction === "right"
          ? i * 4 + 3 - n
          : direction === "up"
            ? n * 4 + i
            : (3 - n) * 4 + i,
    );
    const merged = mergeLine(indices.map((index) => board[index]!));
    score += merged.score;
    indices.forEach((index, n) => {
      output[index] = merged.line[n]!;
    });
  }
  return {
    board: output,
    score,
    changed: board.some((value, i) => value !== output[i]),
  };
}
export function canMove(board: number[]): boolean {
  return (
    board.includes(0) ||
    (["up", "right", "down", "left"] as const).some(
      (direction) => move(board, direction).changed,
    )
  );
}
