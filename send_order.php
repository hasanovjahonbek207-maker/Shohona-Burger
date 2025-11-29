<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Telegram Bot sozlamalari
$botToken = "8408710265:AAG12QhusSeYmHuKTwcYu3UHvlSmaVpzLjI";  // BotFather dan olgan token
$chatId = "7107407073";      // O'zingizning telegram ID

// POST ma'lumotlarini olish
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Ma\'lumot topilmadi']);
    exit;
}

// Buyurtma ma'lumotlarini olish
$name = $data['name'] ?? '';
$phone = $data['phone'] ?? '';
$time = $data['time'] ?? '';
$items = $data['items'] ?? [];
$total = $data['total'] ?? 0;

// Xabar tayyorlash
$message = "🆕 YANGI BUYURTMA!\n\n";
$message .= "👤 Ism: $name\n";
$message .= "📱 Telefon: $phone\n";
$message .= "🕐 Soat: $time\n\n";
$message .= "🛒 BUYURTMA RO'YXATI:\n";
$message .= "━━━━━━━━━━━━━━━━\n";

foreach ($items as $item) {
    $message .= "• {$item['name']}\n";
    $message .= "  {$item['quantity']} x " . number_format($item['price']) . " so'm\n";
    $message .= "  Jami: " . number_format($item['price'] * $item['quantity']) . " so'm\n\n";
}

$message .= "━━━━━━━━━━━━━━━━\n";
$message .= "💰 JAMI SUMMA: " . number_format($total) . " so'm\n\n";
$message .= "📅 Sana: " . date('d.m.Y H:i');

// Telegram API ga yuborish
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    echo json_encode(['success' => true, 'message' => 'Buyurtma yuborildi']);
} else {
    echo json_encode(['success' => false, 'message' => 'Xatolik yuz berdi', 'response' => $response]);
}
?>