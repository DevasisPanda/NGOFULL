-- Fix Primary System Admin Email Typo & Set System Admin Privileges
UPDATE `users` 
SET `email` = 'valmikisamajcharitabletrust@gmail.com', `isSystemAdmin` = 1, `status` = 'active', `role` = 'admin' 
WHERE `email` = 'valmikisamajchiritabletrust@gmail.com';

-- Ensure Secondary System Admin has System Admin Privileges
UPDATE `users` 
SET `isSystemAdmin` = 1, `status` = 'active', `role` = 'admin' 
WHERE `email` = 'narayanrathodtnt@gmail.com';
