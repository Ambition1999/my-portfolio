# Triển khai website

Website gồm `index.html` và thư mục `assets/` chứa CSS/JavaScript. Không cần build hoặc server ứng dụng. Công cụ trong `scripts/` chỉ phục vụ phát triển và kiểm tra.

## Kiểm tra trước khi triển khai

```bash
npm run check
```

Xem lại tên, mô tả, kỹ năng, liên kết dự án và các trạng thái **Đang cập nhật** trước khi chia sẻ.

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

Tải `index.html` và toàn bộ thư mục `assets/` lên cùng thư mục công khai của hosting. Nếu nền tảng yêu cầu cấu hình:

| Trường | Giá trị |
| --- | --- |
| Loại dự án | Static HTML / Other |
| Build command | Không có |
| File đầu vào | `index.html` |
| Thư mục public | Thư mục chứa `index.html` và `assets/` |
| Biến môi trường | Không cần |

Với cách upload thủ công, giữ cấu trúc dưới đây; không cần đưa `.git`, tài liệu và các script phát triển lên hosting:

```text
public/
├── index.html
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── config.js
        ├── main.js
        └── theme-init.js
```

Nếu bổ sung ảnh/CV, upload kèm thư mục tương ứng bên trong `assets/`. Các URL dạng `./assets/...` được tính tương đối từ trang nên dùng được khi GitHub Pages phục vụ repository trong thư mục con.

## Xác minh sau khi xuất bản

- Mở URL trên điện thoại và desktop.
- Kiểm tra đổi sáng/tối và menu.
- Mở từng liên kết GitHub/Demo.
- Kiểm tra form đúng theo trạng thái cấu hình: sao chép lời nhắn hoặc mở ứng dụng email.

Để form gửi trực tiếp và nhận thông báo mà không mở ứng dụng email, cần bổ sung backend hoặc dịch vụ form riêng; hosting tĩnh không tự cung cấp chức năng đó.
