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

Tạo một file có tên là `.env` ở cấu trúc thư mục gốc của dự án và điền thông tin Supabase của bạn:
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

## Hướng Dẫn Push Code Lên GitHub Không Kèm File .env

File `.env` đã được mặc định thêm vào file `.gitignore` để tránh bị lộ thông tin cấu hình và API key. Tuy nhiên, nếu bạn đã tình cờ commit file `.env` trước đó, bạn có thể gỡ nó ra khỏi lịch sử quản lý của Git bằng chuỗi lệnh (Terminal) dưới đây:

```bash
# 1. Xoá file .env khỏi Git cache (nhưng giữ nguyên file trong máy tính của bạn)
git rm --cached .env

# 2. Add và Commit sự thay đổi
git commit -m "Xoá .env khỏi Git tracking"

# 3. Đẩy code lên GitHub
git push origin main
```
Từ các lần push sau, Git sẽ tự động bỏ qua file `.env` nhờ cài đặt trong file `.gitignore`.

## Triển khai (Deployment)
Vui lòng tham khảo file [DEPLOYMENT.md](./DEPLOYMENT.md) để biết thêm cấu hình chi tiết về cách đưa dự án lên Vercel.

## Cấu trúc thư mục
- `src/components/`: Chứa các React components có thể tái sử dụng.
- `src/store/`: Quản lý state của ứng dụng với Zustand.
- `src/lib/`: Các tiện ích cấu hình (ví dụ như khởi tạo kết nối `supabase.ts`).
- `src/types/`: Chứa định nghĩa kiểu dữ liệu cho TypeScript.
