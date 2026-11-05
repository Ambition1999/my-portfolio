# Hướng dẫn đóng góp

## Chuẩn bị

1. Dùng Node.js 20 trở lên; `.nvmrc` chọn phiên bản 24 cho nvm và CI.
2. Chạy `npm run dev` để xem website qua HTTP.
3. Chạy `npm run check` trước và sau khi thay đổi.

Không cần cài dependency cho cấu trúc hiện tại. Giữ `package-lock.json` trong Git nếu bổ sung package sau này.

## Quy ước

- Đặt `index.html`, `en.html` và `assets/` cùng cấp để cả hai trang mở trực tiếp trong trình duyệt.
- Cập nhật nội dung và liên kết theo cặp Việt–Anh. Giữ ID các mục đồng nhất giữa hai trang.
- Đặt CSS trong `assets/css/` và JavaScript trong `assets/js/`. Tải script khởi tạo theme trước stylesheet và giữ `defer` cho `main.js`.
- Dùng tiếng Việt cho tài liệu chính. Dịch cả metadata, nội dung và nhãn điều khiển khi sửa giao diện.
- Chỉ đăng thông tin cá nhân, công nghệ và thành tích đã xác thực và được phép công khai.
- Đặt tên class CSS mô tả chức năng. Dùng `const` và `let`, xử lý lỗi và giữ nhãn truy cập cho các nút.
- Dùng UTF-8, LF và 2 dấu cách theo `.editorconfig` cho phần mã viết mới.
- Cập nhật README/tài liệu nếu thay đổi cấu hình, lệnh chạy hoặc cấu trúc thư mục.

## Quy trình Git

Tạo nhánh theo nội dung công việc, ví dụ `feat/tech-stack`, `fix/mobile-menu` hoặc `docs/update-readme`.

Ví dụ commit:

```text
feat: add the English portfolio
fix: correct mobile navigation spacing
docs: update local setup instructions
chore: configure repository checks
```

Đây là quy ước đặt tên, không có Git hook tự động chặn commit.

Trước khi mở pull request:

1. Chạy `npm run check` và xử lý lỗi.
2. Kiểm tra cả hai ngôn ngữ trên điện thoại và desktop trong hai chế độ sáng/tối nếu sửa giao diện.
3. Mô tả vấn đề, thay đổi chính và cách đã kiểm tra; kèm ảnh nếu có thay đổi trực quan.
4. Kiểm tra `git diff` để tránh đưa file tạm hoặc thông tin riêng vào commit.
