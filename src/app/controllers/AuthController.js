const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const generateUserId = (userCount) => {
    const userIdNumber = userCount + 1;
    return `U${userIdNumber.toString().padStart(3, '0')}`;
};

// Hiển thị trang đăng ký
exports.register_get = (req, res) => {
    res.render('./auth/register', { layout: 'main', showHeader: false });
};

// Hiển thị trang đăng nhập
exports.login_get = (req, res) => {
    res.render('./auth/login', { layout: 'main', showHeader: false });
}
// Đăng ký người dùng mới
exports.register_post = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body)
    try {
        // Kiểm tra xem email đã tồn tại chưa
        const checkEmailSql = 'SELECT * FROM users WHERE `email` = ?';
        db.query(checkEmailSql, [email], async (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            if (data.length > 0) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }
       
            // Đếm số lượng người dùng hiện có để tạo user_id
            const countUsersSql = 'SELECT COUNT(*) as count FROM users';
            db.query(countUsersSql, async (countErr, countData) => {
                if (countErr) {
                    return res.status(500).json({ message: "Lỗi server" });
                }
                const userId = generateUserId(countData[0].count);
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertSql = 'INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`) VALUES (?)';
                const role = 'user';
                const values = [userId, name, email, hashedPassword, role];
                db.query(insertSql, [values], (insertErr, insertData) => {
                    if (insertErr) {
                        return res.status(500).json({ message: "Lỗi server" });
                    }
                    return res.redirect('/auth-login');
                });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// Đăng nhập người dùng
exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT * FROM users WHERE `email` = ?';
        db.query(sql, [email], async (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            if (data.length === 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const user = data[0];
            console.log(user);
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Mật khẩu không đúng" });
            }
            return res.redirect('/');
            // const token = jwt.sign({ id: user.user_id }, 'secret', { expiresIn: '1h' });
            // // Lấy tất cả thông tin của user để lưu trữ vào LocalStorage
            // userId = user.user_id;
            // // Lấy các coursese đã đăng ký
            // const getCoursesEnrolled = new Promise((resolve, reject) => {
            //     const query = 'SELECT * FROM enrollments WHERE `student_id` = ?';
            //     db.query(query, [userId], (err, data) => {
            //         if (err) {
            //             reject("undefined error while getting courses enrolled");
            //         } else {
            //             resolve(data);
            //         }
            //     });
            // });

            // const getNotifications = new Promise((resolve, reject) => {
            //     const query = 'SELECT * FROM notifications WHERE `user_id` = ? LIMIT 20';
            //     db.query(query, [userId], (err, data) => {
            //         if (err) {
            //             reject("undefined error while getting notifications");
            //         } else {
            //             resolve(data);
            //         }
            //     });
            // });

            // const getPayments = new Promise((resolve, reject) => {
            //     const query = 'SELECT * FROM payments WHERE `student_id` = ?';
            //     db.query(query, [userId], (err, data) => {
            //         if (err) {
            //             reject("undefined error while getting payment infos");
            //         } else {
            //             resolve(data);
            //         }
            //     });
            // });

            // const getPersonalInfo = new Promise((resolve, reject) => {
            //     const query = 'SELECT * FROM personal WHERE `user_id` = ?';
            //     db.query(query, [userId], (err, data) => {
            //         if (err) {
            //             reject("undefined error while getting personal info");
            //         } else {
            //             resolve(data);
            //         }
            //     });
            // });

            // try {
            //     const [coursesEnrolled, notifications, payments, personalInfo] = await Promise.all([
            //         getCoursesEnrolled,
            //         getNotifications,
            //         getPayments,
            //         getPersonalInfo
            //     ]);

            //     const userData = {
            //         coursesEnrolled,
            //         notifications,
            //         payments,
            //         personalInfo
            //     };
            //     console.log(userData);
            //     // Cập nhật last_login
            //     const updateLastLoginSql = 'UPDATE users SET last_login = ? WHERE user_id = ?';
            //     db.query(updateLastLoginSql, [new Date(), user.user_id], (updateErr) => {
            //         if (updateErr) {
            //             return res.status(500).json({ message: "Lỗi server khi cập nhật thông tin đăng nhập" });
            //         }
            //         // Trả về dữ liệu người dùng và token sau khi đăng nhập thành công
            //         return res.status(200).json({ message: "Đăng nhập thành công", token, user, userData });
            //     });

            // } catch (error) {
            //     return res.status(500).json({ message: error });
            // }
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};