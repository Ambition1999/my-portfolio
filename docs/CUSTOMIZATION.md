# Tùy chỉnh portfolio

Cập nhật cùng một thông tin trong [bản tiếng Việt](../index.html) và [bản tiếng Anh](../en.html). Hai bản dùng chung [CSS](../assets/css/styles.css) và [JavaScript](../assets/js/main.js).

## Nội dung Việt–Anh

| Phần | Vị trí tìm kiếm trong cả hai trang |
| --- | --- |
| Tiêu đề tab và mô tả | `<title>`, `<meta name="description">` |
| Chức danh và số năm kinh nghiệm | `#home` |
| Các nhóm công nghệ | `#skills` |
| Case Loyalty | `#experience` |
| Quy trình phát triển có AI hỗ trợ | `#ai-workflow` |
| Cách làm việc | `#about` |
| Hồ sơ GitHub | `#contact` |

- Cập nhật chức danh và số năm kinh nghiệm ở phần mở đầu cùng metadata của cả hai trang.
- Giữ thứ tự, ID của các mục và tên công nghệ đồng nhất. Dịch tiêu đề, nội dung, nút và nhãn trợ năng theo ngôn ngữ của mỗi trang.
- Giữ `lang="vi"` trên `index.html` và `lang="en"` trên `en.html`. Liên kết đổi ngôn ngữ trỏ tới `./en.html` hoặc `./index.html`.
- Giữ case Loyalty ẩn danh. Chỉ thêm công nghệ, phạm vi công việc và kết quả có thể xác nhận và công khai.
- Đặt thông tin liên hệ công khai trong `#contact` của cả hai trang. Dùng `rel="noopener noreferrer"` với liên kết mở tab mới.

## Giao diện và hành vi dùng chung

Các biến màu được định nghĩa ở `:root` và `[data-theme="dark"]` trong `assets/css/styles.css`. Nếu đổi màu nền toàn trang, cập nhật `theme-color` trong hai trang và hàm `updateThemeControl()` trong `assets/js/main.js`.

Giữ `theme-init.js` trước stylesheet để khôi phục theme sớm. `main.js` quản lý theme, menu, điều hướng và các nhãn động theo ngôn ngữ của trang.

## Kiểm tra

```bash
npm run check
```

Lệnh kiểm tra cả hai trang, bao gồm metadata, ID, thứ tự các mục, liên kết đổi ngôn ngữ, đường dẫn nội bộ và cú pháp JavaScript. Thử thêm cả hai ngôn ngữ trên trình duyệt ở 320, 390, 768 và 1440 px, trong theme sáng và tối. Dùng bàn phím để thử menu, rồi đổi ngôn ngữ khi mở qua HTTP và khi mở file trực tiếp.

## Thêm tài nguyên

Đặt tài nguyên dùng chung trong `assets/` và dùng đường dẫn tương đối từ hai trang, ví dụ `./assets/images/example.webp`. Trong `url(...)` của stylesheet, tính đường dẫn từ `assets/css/styles.css`, ví dụ `../images/example.webp`. Kiểm tra Network trong trình duyệt khi thêm tài nguyên tham chiếu từ CSS.
