# Minh Nhựt Knowledge Base

Hệ thống quản lý kiến thức cá nhân (Knowledge Base) với giao diện trực quan, hiện đại. Dự án được xây dựng bằng React, Vite, TypeScript, TailwindCSS và sử dụng Supabase làm backend.

## Tính Năng Chính
- **Quản lý ghi chú/Bài viết:** Thêm, sửa, xoá và tìm kiếm nhanh chóng.
- **Tích hợp Backend:** Sử dụng Supabase cho cơ sở dữ liệu và xác thực.
- **Giao diện hiện đại:** Được thiết kế tối ưu với Tailwind CSS và các hiệu ứng mượt mà.
- **State Management:** Quản lý state hiệu quả với Zustand.

## Cài Đặt Khởi Tạo (Locally)

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18 trở lên.
- **Trình quản lý gói**: npm / yarn / pnpm.
- **Tài khoản Supabase**: Để lấy thông tin kết nối DB.

### 2. Tải mã nguồn về máy
```bash
git clone https://github.com/MinhNhut1103/knowledge-base.git
cd knowledge-base
```

### 3. Cài đặt Dependencies
```bash
npm install
# Hoặc yarn install
```

### 4. Cấu hình Biến Môi Trường (Quan trọng)
*Lưu ý: File `.env` chứa các khoá bí mật nên đã được định cấu hình bằng `.gitignore` để không push lên GitHub.*

Dự án có sẵn một file `.env.sample`. Bạn hãy copy/đổi tên file này thành `.env` (hoặc tạo một file `.env` mới) ở thư mục gốc của dự án và điền thông tin Supabase của bạn vào:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Chạy project
```bash
npm run dev
# Hoặc yarn dev
```
Trang web sẽ chạy tại `http://localhost:5173`.

## Quản Lý Biến Môi Trường Khi Push Code Lên GitHub

File `.env` đã được mặc định thêm vào file `.gitignore` để tránh việc vô tình commit các thông tin cấu hình nhạy cảm và API key lên GitHub.

Khi bạn thêm các biến môi trường mới vào dự án (ví dụ biến AI_API_KEY), hãy làm theo các bước sau để đảm bảo người khác (hoặc chính bạn lúc deploy) có thể biết được dự án cần những biến môi trường nào:

1. Thêm khoá bí mật thực sự vào file `.env` (file này sẽ nằm yên ở máy bạn).
2. Thêm tên biến (bỏ trống giá trị) vào file `.env.sample`.
3. Khi push code lên GitHub, bạn chỉ cần commit file `.env.sample`, Git sẽ tự động bỏ qua file `.env`.

```bash
# Add file .env.sample sau khi cập nhật
git add .env.sample

# Commit sự thay đổi
git commit -m "chore: Cập nhật biến môi trường cần thiết vào .env.sample"

# Đẩy code lên GitHub
git push origin main
```

## Triển khai (Deployment)
Vui lòng tham khảo file [DEPLOYMENT.md](./DEPLOYMENT.md) để biết thêm cấu hình chi tiết về cách đưa dự án lên Vercel.

## Cấu trúc thư mục
- `src/components/`: Chứa các React components có thể tái sử dụng.
- `src/store/`: Quản lý state của ứng dụng với Zustand.
- `src/lib/`: Các tiện ích cấu hình (ví dụ như khởi tạo kết nối `supabase.ts`).
- `src/types/`: Chứa định nghĩa kiểu dữ liệu cho TypeScript.
