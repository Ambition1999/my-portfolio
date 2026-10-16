# Hướng dẫn đóng góp

## Chuẩn bị

1. Dùng Node.js 20 trở lên; `.nvmrc` chọn phiên bản 24 cho nvm và CI.
2. Chạy `npm run dev` để xem website qua HTTP.
3. Chạy `npm run check` trước và sau khi thay đổi.

Không cần cài dependency cho cấu trúc hiện tại. Giữ `package-lock.json` trong Git nếu bổ sung package sau này.

## Quy ước

- Giữ khả năng mở `index.html` trực tiếp khi đi kèm thư mục `assets/`.
- Nội dung nằm trong `index.html`, CSS trong `assets/css/`, JavaScript trong `assets/js/`; tránh thêm script/style inline.
- Thông tin liên hệ đặt tại `assets/js/config.js`. Giữ script khởi tạo theme trước stylesheet và thứ tự `config.js` → `main.js` với `defer`.
- Nội dung giao diện và tài liệu chính dùng tiếng Việt.
- Chỉ đưa thông tin cá nhân, công nghệ và thành tích đã xác thực vào portfolio.
- Đặt tên class CSS mô tả chức năng; dùng `const`/`let`, xử lý lỗi và giữ nhãn truy cập cho các nút.
- Dùng UTF-8, LF và 2 dấu cách theo `.editorconfig` cho phần mã viết mới.
- Cập nhật README/tài liệu nếu thay đổi cấu hình, lệnh chạy hoặc cấu trúc thư mục.
- Các giá trị trong HTML/JavaScript frontend đều có thể được khách truy cập đọc; cấu hình liên hệ ở đây chỉ dành cho thông tin công khai.

## Quy trình Git

Tạo nhánh theo nội dung công việc, ví dụ `feat/project-gallery`, `fix/mobile-menu` hoặc `docs/update-readme`.

Ví dụ commit:

```text
feat: add a featured project
fix: correct mobile navigation spacing
docs: update local setup instructions
chore: configure repository checks
```

Đây là quy ước đặt tên, không có Git hook tự động chặn commit.

Trước khi mở pull request:

1. Chạy `npm run check` và xử lý lỗi.
2. Kiểm tra màn hình điện thoại, desktop và hai chế độ sáng/tối nếu sửa giao diện.
3. Mô tả vấn đề, thay đổi chính và cách đã kiểm tra; kèm ảnh nếu có thay đổi trực quan.
4. Kiểm tra `git diff` để tránh đưa file tạm hoặc thông tin riêng vào commit.
