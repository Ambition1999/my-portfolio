# Triển khai website

Website tĩnh gồm `index.html` cho tiếng Việt mặc định, `en.html` cho tiếng Anh và thư mục `assets/` dùng chung. Lệnh build đóng gói ba mục này vào `dist/`.

## Kiểm tra trước khi triển khai

```bash
npm run check
npm run build
```

Chạy từ thư mục gốc của repository. Xem lại tiêu đề, mô tả, năng lực kỹ thuật, nội dung case ẩn danh và liên kết GitHub trên cả hai trang. Chỉ merge pull request vào `main` sau khi workflow `Repository checks` chạy thành công cả kiểm tra và build.

## Vercel

Dùng thư mục gốc repository làm Root Directory. Cấu hình trong `vercel.json` dùng preset tĩnh (`framework: null`), lệnh cài đặt rỗng, lệnh build `npm run check && npm run build` và thư mục đầu ra `dist`. Tùy chọn `cleanUrls: false` giữ URL bản tiếng Anh ở `/en.html`.

### Phát hành lần đầu

1. Chuyển sang `main` sau khi merge, lấy mã nguồn mới nhất và chạy lại kiểm tra từ thư mục gốc.

   ```bash
   git switch main
   git pull --ff-only origin main
   npm run check
   npm run build
   ```

2. Đăng nhập Vercel, liên kết thư mục với project đích và tạo bản production để kiểm tra trước khi gắn domain production.

   ```bash
   npx vercel login
   npx vercel link
   npx vercel deploy --prod --skip-domain --logs
   ```

3. Xác nhận bản dựng đã `Ready` và đang `Staged` trong Vercel. Mở URL deployment mà lệnh trả về và chạy các bước xác minh ở cuối tài liệu. Sau khi kiểm tra đạt, thay `STAGED_DEPLOYMENT_URL` bằng URL đó và chạy lệnh promote.

   ```bash
   npx vercel promote "STAGED_DEPLOYMENT_URL"
   ```

4. Mở domain production do Vercel hiển thị và kiểm tra lại `/` cùng `/en.html`. Sau đó liên kết project với repository GitHub và kiểm tra nhánh Production của project là `main`.

   ```bash
   npx vercel git connect https://github.com/Ambition1999/my-portfolio
   ```

## GitHub Pages

Có thể triển khai hai trang nguồn từ nhánh `main` và thư mục gốc.

1. Đưa mã nguồn lên repository `Ambition1999/my-portfolio`.
2. Mở **Settings → Pages** của repository.
3. Trong **Build and deployment**, chọn nguồn **Deploy from a branch**.
4. Chọn nhánh `main` và thư mục `/(root)`, rồi lưu.
5. Theo dõi quá trình publish và lấy URL do GitHub trả về trong trang Pages.

Tùy chọn Pages có thể phụ thuộc loại tài khoản và quyền truy cập repository. Xem [hướng dẫn chính thức về nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Workflow `.github/workflows/check.yml` chạy kiểm tra và build. Bật xuất bản Pages trong phần cài đặt repository nếu chọn hình thức này.

## Hosting tĩnh khác

Chạy `npm run build` rồi tải nội dung của `dist/` lên thư mục công khai của hosting.

| Trường | Giá trị |
| --- | --- |
| Loại dự án | Static HTML / Other |
| Build command | `npm run build` nếu hosting chạy build |
| Trang mặc định | `index.html` |
| Thư mục đầu ra | `dist/` |
| Biến môi trường | Không cần |

Gói tĩnh có cấu trúc dưới đây.

```text
dist/
├── index.html
├── en.html
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js
        └── theme-init.js
```

Các URL như `./en.html` và `./assets/...` được tính tương đối từ trang nên dùng được khi GitHub Pages phục vụ repository trong thư mục con.

## Xác minh sau khi xuất bản

- Mở `/`, `/index.html` và `/en.html` trên điện thoại và desktop. Thử liên kết đổi ngôn ngữ theo cả hai chiều.
- Kiểm tra CSS, JavaScript, menu, mục `#ai-workflow` và lựa chọn sáng/tối khi đổi trang.
- Mở liên kết hồ sơ GitHub từ cả hai trang.
- Kiểm tra `/package.json` và `/scripts/dev-server.mjs` trả mã HTTP `404`.
