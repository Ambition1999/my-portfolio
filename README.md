# Lê Chí Toàn — Personal Portfolio

Portfolio Việt–Anh của **Lê Chí Toàn**, Senior .NET Full Stack Developer với 6 năm kinh nghiệm tại TP. Hồ Chí Minh.

[GitHub cá nhân](https://github.com/Ambition1999) · [Hướng dẫn tùy chỉnh](docs/CUSTOMIZATION.md) · [Hướng dẫn triển khai](docs/DEPLOYMENT.md)

## Giới thiệu

Website sử dụng HTML, CSS và JavaScript thuần. Bản tiếng Việt nằm trong `index.html`, bản tiếng Anh nằm trong `en.html`. Hai trang dùng chung CSS và JavaScript trong `assets/`. Node.js phục vụ phát triển và kiểm tra trên máy.

- Phần mở đầu dẫn tới sáu nhóm năng lực kỹ thuật, với .NET đứng đầu.
- Case ẩn danh về nền tảng Loyalty quốc tế, quy trình phát triển có AI hỗ trợ và cách làm việc với nhóm.
- Điều hướng bằng bàn phím, liên kết đổi ngôn ngữ, giao diện sáng/tối và liên kết hồ sơ GitHub.

## Chạy nhanh

### Mở trực tiếp

Mở `index.html` hoặc `en.html` bằng trình duyệt. Đặt hai file HTML và thư mục `assets/` cùng cấp để tài nguyên và liên kết đổi ngôn ngữ hoạt động.

### Chạy bằng HTTP trên máy

Cần Node.js **20 trở lên**. File `.nvmrc` chọn Node.js 24 cho môi trường dùng nvm và GitHub Actions.

```bash
git clone https://github.com/Ambition1999/my-portfolio.git
cd my-portfolio
npm run dev
```

Nếu môi trường chỉ có Node.js, chạy `node scripts/dev-server.mjs`. Mở **http://127.0.0.1:3000/** cho tiếng Việt hoặc **http://127.0.0.1:3000/en.html** cho tiếng Anh. Sau khi sửa file, tải lại trình duyệt. Nhấn `Ctrl+C` để dừng server.

Đổi cổng trong PowerShell:

```powershell
$env:PORT = "4000"
npm run dev
```

Trên macOS/Linux:

```bash
PORT=4000 npm run dev
```

Server phát triển phục vụ `/`, `/index.html`, `/en.html` và tài nguyên công khai trong `/assets/` tại địa chỉ loopback.

## Cấu trúc repository

```text
my-portfolio/
├── .github/
│   ├── workflows/
│   │   └── check.yml       # Kiểm tra tự động trên GitHub Actions
│   └── dependabot.yml      # Đề xuất cập nhật phiên bản GitHub Actions
├── assets/
│   ├── css/
│   │   └── styles.css      # Biến màu, bố cục, thành phần và responsive
│   └── js/
│       ├── main.js         # Đổi theme, menu và điều hướng
│       └── theme-init.js   # Khôi phục theme trước khi hiển thị trang
├── docs/
│   ├── CUSTOMIZATION.md   # Sửa hai bản ngôn ngữ và giao diện chung
│   └── DEPLOYMENT.md      # Hướng dẫn đưa website lên hosting tĩnh
├── scripts/
│   ├── check.mjs          # Kiểm tra hai trang HTML, tài nguyên và JavaScript
│   ├── build.mjs          # Đóng gói website tĩnh vào dist/
│   └── dev-server.mjs     # Server local, không cần thư viện ngoài
├── .editorconfig          # UTF-8, LF, thụt dòng 2 dấu cách
├── .gitattributes         # Chuẩn hóa xuống dòng khi dùng Git
├── .gitignore             # Bỏ qua dependency, cache, log và cấu hình riêng
├── .nvmrc                 # Phiên bản Node.js dùng trong CI
├── CONTRIBUTING.md        # Quy ước chỉnh sửa và kiểm tra trước khi commit
├── index.html             # Portfolio tiếng Việt mặc định
├── en.html                # Portfolio tiếng Anh
├── package.json           # Metadata và các lệnh phát triển
├── package-lock.json      # Lockfile npm được theo dõi trong Git
├── vercel.json            # Cấu hình build và đầu ra trên Vercel
└── README.md
```

Hai trang dùng đường dẫn tương đối như `./en.html` và `./assets/css/styles.css` để hoạt động cả khi được phục vụ từ thư mục con.

### Thứ tự tải tài nguyên

1. `theme-init.js` chạy trong `<head>` trước stylesheet để khôi phục lựa chọn sáng/tối, tránh nháy màu.
2. `styles.css` định nghĩa giao diện và responsive.
3. `main.js` chạy sau khi HTML được phân tích và dùng ngôn ngữ của trang để chọn nhãn động cho menu và theme.

## Các lệnh

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Mở server local ở cổng 3000 hoặc cổng từ `PORT` |
| `npm run check` | Kiểm tra metadata, ID, thứ tự các mục, liên kết đổi ngôn ngữ và tài nguyên của cả hai trang cùng cú pháp JavaScript |
| `npm run build` | Đóng gói hai trang và `assets/` vào `dist/` |

`npm run check` không thay thế trình kiểm tra HTML đầy đủ hoặc kiểm thử trên trình duyệt. Kiểm tra này không xác thực tình trạng hoạt động của các liên kết bên ngoài.

## Cập nhật nội dung

Cập nhật cùng một thông tin trong `index.html` và `en.html`, bao gồm liên kết GitHub tại `#contact`. Xem [hướng dẫn tùy chỉnh](docs/CUSTOMIZATION.md).

## Kiểm tra trước khi chia sẻ

```bash
npm run check
npm run build
```

Sau đó kiểm tra thủ công:

- Thử cả hai ngôn ngữ ở 320, 390, 768 và 1440 px trong giao diện sáng và tối.
- Dùng bàn phím để mở và đóng menu bằng `Escape`, rồi thử các liên kết nội bộ.
- Đổi ngôn ngữ qua HTTP và khi mở file trực tiếp. Kiểm tra lựa chọn giao diện khi đổi trang qua HTTP.
- Tắt JavaScript và kiểm tra nội dung, điều hướng và liên kết GitHub vẫn truy cập được.

Workflow `Repository checks` chạy kiểm tra và build khi push hoặc mở pull request. Tham khảo [actions/checkout](https://github.com/actions/checkout) và [actions/setup-node](https://github.com/actions/setup-node) khi cập nhật cấu hình CI.

## Triển khai

Vercel phục vụ gói tĩnh trong `dist/` với bản tiếng Việt ở `/` và bản tiếng Anh ở `/en.html`. Xem quy trình kiểm tra bản production trước khi gắn domain. [Hướng dẫn triển khai](docs/DEPLOYMENT.md)

## Đóng góp và giấy phép

Quy ước chỉnh sửa được mô tả trong [CONTRIBUTING.md](CONTRIBUTING.md).

Repository chưa chọn giấy phép phân phối mã nguồn. `package.json` đặt `private: true` để tránh xuất bản nhầm lên npm và `license: "UNLICENSED"` để phản ánh trạng thái hiện tại; chủ sở hữu có thể bổ sung `LICENSE` và cập nhật trường này khi chọn giấy phép.
