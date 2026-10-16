# Tùy chỉnh portfolio

Nội dung nằm trong [`index.html`](../index.html), giao diện trong [`assets/css/styles.css`](../assets/css/styles.css), hành vi trong [`assets/js/main.js`](../assets/js/main.js) và cấu hình liên hệ trong [`assets/js/config.js`](../assets/js/config.js).

Các mốc tìm kiếm:

| Phần | Vị trí tìm kiếm |
| --- | --- |
| Tiêu đề tab, mô tả và favicon | `<head>`, `<title>`, `name="description"`, `rel="icon"` |
| Tên thương hiệu | `class="logo"` |
| Hero và tagline | `id="home"`, `id="hero-title"` |
| Giới thiệu và số năm kinh nghiệm | `id="about"` |
| Các nhóm kỹ năng | `id="skills"` |
| Dự án nổi bật | `id="projects"`, `class="project"` |
| Nội dung liên hệ | `id="contact"` |
| Email và LinkedIn | `contact` trong `assets/js/config.js` |
| Màu sắc | `:root` và `[data-theme="dark"]` trong `assets/css/styles.css` |
| Bố cục và responsive | Các nhóm thành phần và `@media` trong `assets/css/styles.css` |
| Hành vi JavaScript | `assets/js/main.js` |
| Theme trước khi tải giao diện | `assets/js/theme-init.js` |

## Email và LinkedIn

Cấu hình hiện tại trong `assets/js/config.js`:

```javascript
window.PORTFOLIO_CONFIG = Object.freeze({
  contact: Object.freeze({
    email: '',
    linkedin: '',
  }),
});
```

Giữ chuỗi rỗng để hiển thị **Đang cập nhật**. Khi đã sẵn sàng, thay bằng email thật và URL dạng `https://www.linkedin.com/in/...` của bạn.

Form không có backend. Với email hợp lệ, JavaScript mở bản nháp bằng `mailto:` và khách truy cập tự gửi từ ứng dụng email. Khi chưa có email, form hỗ trợ sao chép lời nhắn, có phương án sao chép thủ công nếu trình duyệt từ chối clipboard.

Chỉ bổ sung dịch vụ gửi form khi có nhu cầu thực tế; `.env` hiện không được website đọc. Các biến cần giữ bí mật phải được xử lý phía server của dịch vụ đó.

## Nội dung chữ

Tagline hiện tại: **Từ ý tưởng. Đến sản phẩm.**

Một số phương án thay thế:

- **Giao diện chỉn chu. Hệ thống vững chắc.**
- **Hiểu bài toán. Xây giải pháp.**
- **Biến bài toán phức tạp thành trải nghiệm đơn giản.**

Khi thay số năm kinh nghiệm, cập nhật đồng thời phần mô tả SEO, Hero, About và trường `experience` trong khung code minh họa. Năm bản quyền được JavaScript cập nhật tự động.

## Dự án

Mỗi `<article class="project">` gồm hình minh họa, nhóm dự án, tên, mô tả, các thẻ công nghệ và liên kết.

1. Thay tên và mô tả bằng thông tin đúng với repository.
2. Thay công nghệ theo mã nguồn thực tế.
3. Dùng URL GitHub/Demo hoạt động; nếu chưa có demo, ghi rõ thay vì tạo liên kết giả.
4. Giữ `target="_blank" rel="noopener noreferrer"` cho liên kết mở tab mới.
5. Nếu thay minh họa bằng ảnh chụp thật, cập nhật nhãn và mô tả truy cập tương ứng.

Ba dự án hiện tại liên kết tới repo thực tế. Các hình giao diện cà phê/laptop được dựng bằng CSS và ghi nhãn minh họa.

## Màu sắc và responsive

Các biến CSS dùng chung:

| Biến | Ý nghĩa |
| --- | --- |
| `--bg` | Nền trang |
| `--surface` | Nền thẻ và trường nhập |
| `--text` | Chữ chính |
| `--muted` | Chữ phụ |
| `--line` | Đường viền |
| `--accent` | Màu nhấn |
| `--green` | Màu liên kết và nhãn |

Cập nhật cả bảng sáng và tối trong `assets/css/styles.css`; nếu đổi nền toàn trang, cập nhật thêm màu `theme-color` trong `<head>` của `index.html` và hàm `updateThemeControl()` trong `assets/js/main.js`.

Các breakpoint chính: 1050px, 800px, 600px và 360px. Sau khi chỉnh bố cục, kiểm tra tối thiểu ở 320px, 390px, 768px và 1440px.

## Kiểm tra

```bash
npm run check
```

Lệnh này kiểm tra cú pháp các file JavaScript, metadata cơ bản, ID trùng, tham chiếu nội bộ, file CSS/JS bị thiếu và CSS/JavaScript inline bị thêm lại. Hãy kiểm tra trình duyệt thêm để xác nhận bố cục, thao tác bàn phím và clipboard.

## Thêm tài nguyên

Thêm ảnh vào `assets/images/`, tài liệu PDF vào `assets/documents/` khi cần và tham chiếu bằng đường dẫn tương đối từ `index.html`, ví dụ `./assets/images/project.webp`. Không cần tạo thư mục rỗng trước.

Đường dẫn trong `url(...)` của stylesheet được tính từ `assets/css/styles.css`, nên một ảnh trong `assets/images/` sẽ có đường dẫn `../images/project.webp`. Lệnh kiểm tra hiện xác minh tài nguyên được tham chiếu trong HTML; nếu thêm `url(...)` trong CSS, kiểm tra Network của trình duyệt để phát hiện đường dẫn sai.
