# Lê Chí Toàn — Personal Portfolio

Portfolio cá nhân của **Lê Chí Toàn**, Fullstack Developer với 5 năm kinh nghiệm tại TP. Hồ Chí Minh.

> **Từ ý tưởng. Đến sản phẩm.**<br>
> Giao diện chỉn chu. Hệ thống vững chắc.

[GitHub cá nhân](https://github.com/Ambition1999) · [Hướng dẫn tùy chỉnh](docs/CUSTOMIZATION.md) · [Hướng dẫn triển khai](docs/DEPLOYMENT.md)

## Giới thiệu

Website sử dụng HTML5, CSS3 và JavaScript thuần, tách riêng nội dung, giao diện và hành vi. `index.html` chứa cấu trúc trang và icon SVG; CSS và JavaScript nằm trong `assets/`. Node.js chỉ dùng cho công cụ phát triển; website không cần Node.js khi triển khai và không cần bước build.

- Hero với hai nút **Xem dự án** và **Liên hệ**.
- Giới thiệu, triết lý lập trình và 4 nhóm kỹ năng.
- Ba dự án công khai: Cafe Store Management, Laptop Business Website và Dockerized Course Service.
- Giao diện sáng/tối, nhớ lựa chọn trên trình duyệt khi có thể lưu trữ.
- Bố cục responsive, menu điện thoại và hỗ trợ điều hướng bàn phím.
- Form kiểm tra dữ liệu, sao chép lời nhắn hoặc mở bản nháp email khi đã cấu hình.

Hình giao diện trên các thẻ dự án là **minh họa**, không phải ảnh chụp ứng dụng thực tế. Repo chưa khai báo URL website đang hoạt động.

## Chạy nhanh

### Mở trực tiếp

Mở `index.html` bằng Chrome, Edge, Firefox hoặc Safari. Giữ nguyên thư mục `assets/` bên cạnh file HTML để trình duyệt tải CSS và JavaScript. Không cần cài thư viện hay build.

### Chạy bằng HTTP trên máy

Cần Node.js **20 trở lên** và npm. File `.nvmrc` chọn Node.js 24 cho môi trường dùng nvm và GitHub Actions.

```bash
git clone https://github.com/Ambition1999/my-portfolio.git
cd my-portfolio
npm run dev
```

Mở **http://127.0.0.1:3000**. Sửa HTML/CSS/JavaScript, lưu rồi tải lại trình duyệt. Nhấn `Ctrl+C` để dừng server. Không cần `npm install` vì dự án không có dependency.

Đổi cổng trong PowerShell:

```powershell
$env:PORT = "4000"
npm run dev
```

Trên macOS/Linux:

```bash
PORT=4000 npm run dev
```

Server phát triển phục vụ `/`, `/index.html` và các tài nguyên công khai trong `/assets/` tại địa chỉ loopback. Các file cấu hình repo, tài liệu và thư mục `.git` không được phục vụ. Cấu hình liên hệ trong `assets/js/config.js` là dữ liệu công khai của website.

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
│       ├── config.js       # Thông tin liên hệ công khai
│       ├── main.js         # Đổi theme, menu, điều hướng và form
│       └── theme-init.js   # Khôi phục theme trước khi hiển thị trang
├── docs/
│   ├── CUSTOMIZATION.md   # Đổi nội dung, màu sắc, dự án và liên hệ
│   └── DEPLOYMENT.md      # Hướng dẫn đưa website lên hosting tĩnh
├── scripts/
│   ├── check.mjs          # Kiểm tra HTML, đường dẫn assets và JavaScript
│   └── dev-server.mjs     # Server local, không cần thư viện ngoài
├── .editorconfig          # UTF-8, LF, thụt dòng 2 dấu cách
├── .gitattributes         # Chuẩn hóa xuống dòng khi dùng Git
├── .gitignore             # Bỏ qua dependency, cache, log và cấu hình riêng
├── .nvmrc                 # Phiên bản Node.js dùng trong CI
├── CONTRIBUTING.md        # Quy ước chỉnh sửa và kiểm tra trước khi commit
├── index.html             # Cấu trúc và nội dung trang
├── package.json           # Metadata và các lệnh phát triển
├── package-lock.json      # Lockfile npm được theo dõi trong Git
└── README.md
```

Đây là cấu trúc website tĩnh, chưa cần `src/` hoặc `dist/`. Có thể bổ sung ảnh trong `assets/images/`, CV trong `assets/documents/`; server local hỗ trợ các định dạng ảnh phổ biến, SVG, font và PDF. Dùng đường dẫn tương đối như `./assets/images/project.webp` để hỗ trợ GitHub Pages trong thư mục con.

### Thứ tự tải tài nguyên

1. `theme-init.js` chạy trong `<head>` trước stylesheet để khôi phục lựa chọn sáng/tối, tránh nháy màu.
2. `styles.css` định nghĩa giao diện và responsive.
3. `config.js` và `main.js` tải bằng `defer`, chạy theo thứ tự sau khi HTML được phân tích xong.

Các script sử dụng JavaScript thuần, không cần bundler hoặc ES module, nên vẫn hỗ trợ mở trang bằng `file://` khi giữ đủ thư mục tài nguyên.

## Các lệnh

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Mở server local ở cổng 3000 hoặc cổng từ `PORT` |
| `npm run check` | Kiểm tra cú pháp script, metadata, ID trùng, tham chiếu nội bộ, đường dẫn assets và việc tách CSS/JS |

`npm run check` không thay thế trình kiểm tra HTML đầy đủ hoặc kiểm thử trên trình duyệt. Kiểm tra này không xác thực tình trạng hoạt động của các liên kết bên ngoài.

## Cập nhật thông tin cá nhân

Mở [`assets/js/config.js`](assets/js/config.js):

```javascript
window.PORTFOLIO_CONFIG = Object.freeze({
  contact: Object.freeze({
    email: '',
    linkedin: '',
  }),
});
```

Email và LinkedIn hiện được để **Đang cập nhật** theo lựa chọn của chủ portfolio. Khi chưa có email, form chỉ sao chép lời nhắn. Khi điền email hợp lệ, nút sẽ mở ứng dụng email bằng `mailto:`; khách truy cập kiểm tra và tự bấm gửi. Website không có backend gửi mail và không lưu nội dung form trên server.

Xem [hướng dẫn tùy chỉnh](docs/CUSTOMIZATION.md) để cập nhật toàn bộ nội dung.

## Kiểm tra trước khi chia sẻ

```bash
npm run check
```

Sau đó kiểm tra thủ công:

- Giao diện ở màn hình nhỏ và lớn, không xuất hiện thanh cuộn ngang.
- Đổi sáng/tối rồi tải lại trang.
- Menu điện thoại mở, đóng và đóng bằng phím `Escape`.
- Form từ chối email sai, tên trống và lời nhắn quá ngắn.
- Các liên kết GitHub và thông tin dự án chính xác.

Workflow `Repository checks` chạy cùng lệnh khi push hoặc mở pull request. Workflow chỉ kiểm tra mã nguồn, không triển khai website. Tham khảo [actions/checkout](https://github.com/actions/checkout) và [actions/setup-node](https://github.com/actions/setup-node) khi cập nhật cấu hình CI.

## Triển khai

Đầu ra website gồm `index.html` và toàn bộ thư mục `assets/`, không có lệnh build. Xem [DEPLOYMENT.md](docs/DEPLOYMENT.md) để cấu hình GitHub Pages hoặc hosting tĩnh.

## Đóng góp và giấy phép

Quy ước chỉnh sửa được mô tả trong [CONTRIBUTING.md](CONTRIBUTING.md).

Repository chưa chọn giấy phép phân phối mã nguồn. `package.json` đặt `private: true` để tránh xuất bản nhầm lên npm và `license: "UNLICENSED"` để phản ánh trạng thái hiện tại; chủ sở hữu có thể bổ sung `LICENSE` và cập nhật trường này khi chọn giấy phép.
