# Triển khai website

Website tĩnh gồm `index.html` cho tiếng Việt mặc định, `en.html` cho tiếng Anh và thư mục `assets/` dùng chung. Công cụ trong `scripts/` phục vụ phát triển và kiểm tra.

## Kiểm tra trước khi triển khai

```bash
npm run check
```

Xem lại tiêu đề, mô tả, năng lực kỹ thuật, nội dung case ẩn danh và liên kết GitHub trên cả hai trang.

## GitHub Pages

Có thể triển khai từ nhánh `main` và thư mục gốc:

1. Đưa mã nguồn lên repository `Ambition1999/my-portfolio`.
2. Mở **Settings → Pages** của repository.
3. Trong **Build and deployment**, chọn nguồn **Deploy from a branch**.
4. Chọn nhánh `main` và thư mục `/(root)`, rồi lưu.
5. Theo dõi quá trình publish và lấy URL do GitHub trả về trong trang Pages.

Tùy chọn Pages có thể phụ thuộc loại tài khoản và quyền truy cập repository. Xem [hướng dẫn chính thức về nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Workflow `.github/workflows/check.yml` chỉ chạy kiểm tra. Cấu hình này không tự bật Pages hoặc thay đổi quyền truy cập repo. Khi chọn xuất bản từ nhánh, hãy xem kết quả kiểm tra trước khi merge/push thay đổi vào nhánh xuất bản.

## Hosting tĩnh khác

Tải `index.html`, `en.html` và toàn bộ thư mục `assets/` lên cùng thư mục công khai của hosting.

| Trường | Giá trị |
| --- | --- |
| Loại dự án | Static HTML / Other |
| Build command | Không có |
| Trang mặc định | `index.html` |
| Thư mục public | Thư mục chứa `index.html`, `en.html` và `assets/` |
| Biến môi trường | Không cần |

Với cách upload thủ công, dùng cấu trúc dưới đây.

```text
public/
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

- Mở cả hai trang trên điện thoại và desktop. Thử liên kết đổi ngôn ngữ theo cả hai chiều.
- Kiểm tra menu, liên kết nội bộ và lựa chọn sáng/tối khi đổi trang.
- Mở liên kết hồ sơ GitHub từ cả hai trang.
