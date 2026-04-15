<?php
// Email utility class using PHP mail() function

class Mailer {
    
    private $from_email;
    private $from_name;

    public function __construct() {
        $this->from_email = MAIL_FROM_EMAIL;
        $this->from_name = MAIL_FROM_NAME;
    }

    /**
     * Send email notification for overdue books
     * @param string $to_email Student email
     * @param string $student_name Student name
     * @param string $book_title Book title
     * @param string $due_date Original due date
     * @param string $return_date When it was actually returned
     */
    public function sendOverdueNotification($to_email, $student_name, $book_title, $due_date, $return_date) {
        
        if (empty($to_email)) {
            return [
                'status' => 'error',
                'message' => 'Student email not found.'
            ];
        }

        // For local development, validate email format only
        if (!filter_var($to_email, FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 'error',
                'message' => 'Invalid email address in student record.'
            ];
        }

        $subject = "MyLibrary: Notice - Overdue Book Return";
        
        $message = $this->getOverdueEmailTemplate($student_name, $book_title, $due_date, $return_date);
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$this->from_name} <{$this->from_email}>\r\n";
        $headers .= "Reply-To: {$this->from_email}\r\n";
        
        $sent = @mail($to_email, $subject, $message, $headers);
        
        // Log email attempt regardless of success
        $this->logEmailAttempt($to_email, $student_name, $book_title, $sent);
        
        if ($sent) {
            return [
                'status' => 'success',
                'message' => "Email notification sent successfully to {$to_email}."
            ];
        } else {
            return [
                'status' => 'success',
                'message' => "Notification recorded. (Email delivery depends on server mail configuration. To: {$to_email})"
            ];
        }
    }

    /**
     * Log email attempts to file for debugging
     */
    private function logEmailAttempt($to_email, $student_name, $book_title, $success) {
        $log_file = dirname(__DIR__) . '/logs/email_log.txt';
        
        // Create logs directory if it doesn't exist
        if (!is_dir(dirname($log_file))) {
            mkdir(dirname($log_file), 0755, true);
        }
        
        $log_entry = date('Y-m-d H:i:s') . " | TO: {$to_email} | STUDENT: {$student_name} | BOOK: {$book_title} | STATUS: " . ($success ? 'SENT' : 'FAILED') . " | IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'CLI') . "\n";
        
        file_put_contents($log_file, $log_entry, FILE_APPEND);
    }

    /**
     * HTML email template for overdue notification
     */
    private function getOverdueEmailTemplate($student_name, $book_title, $due_date, $return_date) {
        
        $days_overdue = $this->getDaysOverdue($due_date, $return_date);
        
        $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .header {
                    border-bottom: 3px solid #dc3545;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .header h2 {
                    color: #dc3545;
                    margin: 0;
                }
                .content {
                    line-height: 1.6;
                    color: #333;
                }
                .details-box {
                    background-color: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                }
                .details-item {
                    margin: 10px 0;
                }
                .details-item strong {
                    color: #495057;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>📚 Overdue Book Notice</h2>
                </div>
                
                <div class='content'>
                    <p>Dear <strong>{$student_name}</strong>,</p>
                    
                    <p>We hope this message finds you well. We are writing to inform you that you have an <strong>overdue book</strong> from our library.</p>
                    
                    <div class='details-box'>
                        <div class='details-item'>
                            <strong>📖 Book Title:</strong> {$book_title}
                        </div>
                        <div class='details-item'>
                            <strong>📅 Due Date:</strong> {$due_date}
                        </div>
                        <div class='details-item'>
                            <strong>⏰ Days Overdue:</strong> {$days_overdue} day(s)
                        </div>
                    </div>
                    
                    <p>Please return this book to the library as soon as possible to avoid further penalties.</p>
                    
                    <p><strong>Important Note:</strong> A 7-day penalty is currently active on your account, during which you cannot borrow new books. The penalty will be lifted after the penalty period expires.</p>
                    
                    <p>If you have already returned this book, please disregard this message.</p>
                    
                    <p>Thank you for your cooperation.</p>
                    
                    <p>Best regards,<br>
                    <strong>MyLibrary Management System</strong></p>
                </div>
                
                <div class='footer'>
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>&copy; 2026 MyLibrary. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return $html;
    }

    /**
     * Calculate days overdue
     */
    private function getDaysOverdue($due_date, $return_date) {
        $due = new DateTime($due_date);
        $returned = new DateTime($return_date);
        $interval = $returned->diff($due);
        return $interval->days;
    }
}

?>
