import express, { Router } from "express";

// 서버 설정
const PORT = 3001;

// 이미지 원본
const columns = 8;
const rows = 8;
const bitmap = new Array(columns * rows).fill(0);

const app = express();
app.use(express.json());

const router = Router();
router.post("/paint", (req, res) => {
    const data = req.body as { x: number, y: number, color: number };
    const { x, y, color } = data;
    // 색을 칠하고 원본을 돌려준다
    if (x >= 0 && x < columns && y >= 0 && y < rows) {
        bitmap[x + y*columns] = color;
        res.json({
            columns: columns,
            rows: rows,
            bitmap: bitmap,
        })
    } else {
        res.status(422).send("invalid parameter value");
    }
});

router.get("/paint", (req, res) => {
    res.json({
        columns: columns,
        rows: rows,
        bitmap: bitmap,
    });
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log("server listen at port " + PORT);
});