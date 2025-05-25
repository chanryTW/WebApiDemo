#!/bin/bash

# 像素字型，每個字母 5x7
PIXEL_FONT=(
  # C
  "11110"
  "10000"
  "10000"
  "10000"
  "10000"
  "10000"
  "11110"
  # h
  "10001"
  "10001"
  "10001"
  "11111"
  "10001"
  "10001"
  "10001"
  # a
  "01110"
  "10001"
  "10001"
  "11111"
  "10001"
  "10001"
  "10001"
  # n
  "11001"
  "10101"
  "10011"
  "10001"
  "10001"
  "10001"
  "10001"
  # r
  "11110"
  "10001"
  "10000"
  "10000"
  "10000"
  "10000"
  "10000"
  # y
  "10001"
  "10001"
  "10001"
  "01110"
  "00010"
  "00100"
  "01000"
)

START_DATE="2024-05-26" # 貢獻圖第一格
PIXEL_WIDTH=5
PIXEL_HEIGHT=7
LETTERS=6
SPACE=1 # 字母間隔一週

# 清空 README.md
> README.md
git add README.md

for l in {0..5}; do # 6 個字母
  for y in {0..6}; do # 7 行（星期日到六）
    ROW="${PIXEL_FONT[$((l*7+y))]}"
    for x in {0..4}; do # 5 列（每週）
      CHAR=${ROW:$x:1}
      if [ "$CHAR" == "1" ]; then
        week_offset=$((l*(PIXEL_WIDTH+SPACE) + x))
        day_offset=$y
        total_offset=$((week_offset*7 + day_offset))
        COMMIT_DATE=$(date -v+${total_offset}d -jf "%Y-%m-%d" "$START_DATE" +"%Y-%m-%dT12:00:00")
        for c in {1..3}; do
          echo "$COMMIT_DATE fake commit $l $x $y $c" >> README.md
          git add README.md
          GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
          git commit -m "pixel $l $x $y $c" --author="Chanry <chanrytw@gmail.com>"
        done
      fi
    done
  done
done

git push --force origin main 