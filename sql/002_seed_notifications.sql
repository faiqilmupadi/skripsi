INSERT INTO notifications(userId, title, message, isRead)
SELECT userId, 'Welcome', 'Sistem notifikasi siap digunakan', 0 FROM users LIMIT 2;
