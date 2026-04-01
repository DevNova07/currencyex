import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, TrendingUp, Globe, Newspaper, Info, History, User as UserIcon, Activity, Zap, X } from 'lucide-react';
import CurrencyConverter from './components/CurrencyConverter';
import HistoryChart from './components/HistoryChart';
import LiveTicker from './components/LiveTicker';
import MarketNews from './components/MarketNews';
import AIChatbot from './components/AIChatbot';
import AuthModal from './components/AuthModal';
import SavedFavorites from './components/SavedFavorites';
import PortfolioTracker from './components/PortfolioTracker';
import EconomicCalendar from './components/EconomicCalendar';
import MultiCurrencyGrid from './components/MultiCurrencyGrid';
import CurrencyStrength from './components/CurrencyStrength';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import { useRateHistory } from './hooks/useRateHistory';
import { useCurrencyRates } from './hooks/useCurrencyRates';

const TRANSLATIONS = {
  en: { 
    portal: 'Institutional Portal', access: 'Access Portal', intel: 'Market Intelligence Hub', traders: 'Traders',
    clock: 'System Clock (GMT)', history: 'Rate History', favorites: 'Intelligence Watchlist',
    strength: 'Currency Strength', heatmap: 'Correlation Heatmap', multiGrid: 'Global Conversion Grid',
    conv_tool: 'Conversion Tool', enter_amt: 'Enter Amount', from: 'From', to: 'To', live_flow: 'Live Converted Flow',
    bank_fee: '+2% Bank Fee', sync: 'Sync', rate: 'Rate', alert_set: 'Alert set', notify: 'Notify me',
    ext_intel: 'Market Intelligence', news_source: 'Source', fetching: 'Fetching Live Markets...',
    headliner: 'Live Headliner', fin_update: 'Financial Update', volatility: 'Volatility',
    confidence: 'Confidence', history_ledger: 'Institutional History Ledger', indicators: 'Indicators',
    export: 'Export CSV', pulse: 'Economic Pulse', impact_high: 'High Impact', impact_med: 'Medium',
    impact_low: 'Low', expert_tip: 'Expert Tip', pwa_sync: 'Sync App', pwa_terminal: 'Pro Terminal',
    ai_ask: 'Ask AI', ai_greet: 'Namaste! I am your AI assistant. How can I help with market trends today?',
    ai_placeholder: 'Ask anything...', ai_note: 'AI responses can make mistakes', low_risk: 'Low Risk',
    portfolio: 'Asset Portfolio', track_holdings: 'Track Global Holdings', total_val: 'Total Valuation',
    active_holdings: 'Active Holdings', amount: 'Amount', holding: 'Holding', live_node: 'Live Node Data',
    add_asset: 'Add New Asset', asset_cur: 'Asset Currency', qty: 'Quantity / Amount', update_port: 'Update Portfolio',
    watchlist_empty: 'Watchlist Empty', click_to_track: 'Click the star to track', tracked: 'Tracked', quick_access: 'Quick access for',
    live: 'Live', nodes: 'Global Nodes', nominal: 'Nominal', sync_real: 'Real-time', compliance: 'Compliance',
    perf: 'System Performance', latency: 'Network Latency', node_status: 'API Node Status', active_primary: 'Active-Primary',
    rights: 'All rights reserved • data provided by professional exchange nodes', gateway: 'Tier-1 Institutional Gateway. Millisecond latency global network',
    install_now: 'Install Now', search_cur: 'Search currency or country...', no_cur: 'No currencies found',
    welcome: 'Welcome Back', create_acc: 'Create Account', login_sub: 'Log in securely to manage your global currency portfolios.',
    signup_sub: 'Join CurrencyEx for real-time rates and personalized alerts.', full_name: 'Full Name', email: 'Email Address',
    password: 'Password', secure_login: 'Secure Log In', create_prof: 'Create Profile', or_continue: 'OR CONTINUE WITH',
    new_here: 'New to CurrencyEx?', have_acc: 'Already have an account?', login: 'Log In', last_sync: 'Last Sync',
    solutions: 'Solutions', resources: 'Resources', legal: 'Legal', terms: 'Terms of Service', privacy: 'Privacy Policy', 
    spot: 'Spot Trading', api_node: 'API Connectivity', institutional: 'Institutional Hub', dev_hub: 'Developer Hub', help: 'Support Center'
  },
  hi: { 
    portal: 'संस्थागत पोर्टल', access: 'एक्सेस पोर्टल', intel: 'मार्केट इंटेलिजेंस हब', traders: 'व्यापारी',
    clock: 'सिस्टम घड़ी (GMT)', history: 'दर इतिहास', favorites: 'इंटेलिजेंस वॉचलिस्ट',
    strength: 'मुद्रा की ताकत', heatmap: 'सहसंबंध हीटमैप', multiGrid: 'वैश्विक रूपांतरण ग्रिड',
    conv_tool: 'रूपांतरण उपकरण', enter_amt: 'राशि दर्ज करें', from: 'से', to: 'को', live_flow: 'लाइव कनवर्टेड फ्लो',
    bank_fee: '+2% बैंक शुल्क', sync: 'सिंक', rate: 'दर', alert_set: 'अलर्ट सेट', notify: 'मुझे सूचित करें',
    ext_intel: 'मार्केट इंटेलिजेंस', news_source: 'स्रोत', fetching: 'लाइव मार्केट ला रहे हैं...',
    headliner: 'लाइव हेडलाइनर', fin_update: 'वित्तीय अपडेट', volatility: 'अस्थिरता',
    confidence: 'आत्मविश्वास', history_ledger: 'संस्थागत इतिहास खाता', indicators: 'संकेतक',
    export: 'निर्यात CSV', pulse: 'आर्थिक पल्स', impact_high: 'उच्च प्रभाव', impact_med: 'मध्यम',
    impact_low: 'कम', expert_tip: 'विशेषज्ञ टिप', pwa_sync: 'एप्लिकेशन सिंक', pwa_terminal: 'प्रो टर्मिनल',
    ai_ask: 'AI से पूछें', ai_greet: 'नमस्ते! मैं आपका AI सहायक हूँ। आज मैं मार्केट ट्रेंड्स में कैसे मदद कर सकता हूँ?',
    ai_placeholder: 'कुछ भी पूछें...', ai_note: 'AI प्रतिक्रियाएं गलतियां कर सकती हैं', low_risk: 'कम जोखिम',
    portfolio: 'संपत्ति पोर्टफोलियो', track_holdings: 'वैश्विक धारण ट्रैक करें', total_val: 'कुल मूल्यांकन',
    active_holdings: 'सक्रिय होल्डिंग्स', amount: 'राशि', holding: 'होल्डिंग', live_node: 'लाइव नोड डेटा',
    add_asset: 'नई संपत्ति जोड़ें', asset_cur: 'संपत्ति मुद्रा', qty: 'मात्रा / राशि', update_port: 'पोर्टफोलियो अपडेट करें',
    watchlist_empty: 'वॉचलिस्ट खाली है', click_to_track: 'ट्रैक करने के लिए स्टार पर क्लिक करें', tracked: 'ट्रैक किया गया', quick_access: 'त्वरित पहुँच',
    live: 'लाइव', nodes: 'वैश्विक नोड्स', nominal: 'नाममात्र', sync_real: 'असली समय', compliance: 'अनुपालन',
    perf: 'सिस्टम प्रदर्शन', latency: 'नेटवर्क विलंबता', node_status: 'API नोड स्थिति', active_primary: 'सक्रिय-प्राथमिक',
    rights: 'सर्वाधिकार सुरक्षित • पेशेवर एक्सचेंज नोड्स द्वारा डेटा प्रदान किया गया', gateway: 'टियर -1 संस्थागत गेटवे। मिलीसेकंड लेटेंसी ग्लोबल नेटवर्क',
    install_now: 'अब स्थापित करें', search_cur: 'मुद्रा या देश खोजें...', no_cur: 'कोई मुद्रा नहीं मिली',
    welcome: 'वापसी पर स्वागत है', create_acc: 'खाता बनाएं', login_sub: 'अपने वैश्विक मुद्रा पोर्टफोलियो को प्रबंधित करने के लिए सुरक्षित रूप से लॉग इन करें।',
    signup_sub: 'वास्तविक समय की दरों और व्यक्तिगत अलर्ट के लिए CurrencyEx में शामिल हों।', full_name: 'पूरा नाम', email: 'ईमेल पता',
    password: 'पासवर्ड', secure_login: 'सुरक्षित लॉग इन', create_prof: 'प्रोफ़ाइल बनाएं', or_continue: 'या इसके साथ जारी रखें',
    new_here: 'CurrencyEx में नए हैं?', have_acc: 'पहले से ही एक खाता है?', login: 'लॉग इन करें', last_sync: 'अंतिम सिंक',
    solutions: 'समाधान', resources: 'संसाधन', legal: 'कानूनी', terms: 'सेवा की शर्तें', privacy: 'गोपनीयता नीति', 
    spot: 'स्पॉट ट्रेडिंग', api_node: 'API कनेक्टिविटी', institutional: 'संस्थागत हब', dev_hub: 'डेवलपर हब', help: 'सहायता केंद्र'
  },
  ar: { 
    portal: 'بوابة مؤسسية', access: 'الوصول إلى البوابة', intel: 'مركز استخبارات السوق', traders: 'تجار',
    clock: 'ساعة النظام (GMT)', history: 'تاريخ الأسعار', favorites: 'قائمة المراقبة الذكية',
    strength: 'قوة العملة', heatmap: 'خريطة الارتباط الحرارية', multiGrid: 'شبكة التحويل العالمية',
    conv_tool: 'أداة التحويل', enter_amt: 'أدخل المبلغ', from: 'من', to: 'إلى', live_flow: 'تدفق التحويل المباشر',
    bank_fee: '+2% رسوم بنكية', sync: 'مزامنة', rate: 'سعر', alert_set: 'تم ضبط التنبيه', notify: 'أبلغني',
    ext_intel: 'استخبارات السوق', news_source: 'المصدر', fetching: 'جاري جلب الأسواق...',
    headliner: 'العناوين المباشرة', fin_update: 'تحديث مالي', volatility: 'التقلب',
    confidence: 'الثقة', history_ledger: 'سجل التاريخ المؤسسي', indicators: 'مؤشرات',
    export: 'تصدير CSV', pulse: 'النبض الاقتصادي', impact_high: 'تأثير عالي', impact_med: 'متوسط',
    impact_low: 'منخفض', expert_tip: 'نصيحة الخبراء', pwa_sync: 'مزامنة التطبيق', pwa_terminal: 'محطة برو',
    ai_ask: 'اسأل الذكاء الاصطناعي', ai_greet: 'أهلاً! أنا مساعدك الذكي. كيف يمكنني مساعدتك في اتجاهات السوق اليوم؟',
    ai_placeholder: 'اسأل أي شيء...', ai_note: 'ردود الذكاء الاصطناعي قد تخطئ', low_risk: 'مخاطر منخفضة',
    portfolio: 'محفظة الأصول', track_holdings: 'تتبع الحيازات العالمية', total_val: 'إجمالي التقييم',
    active_holdings: 'الحيازات النشطة', amount: 'المبلغ', holding: 'حيازة', live_node: 'بيانات العقدة المباشرة',
    add_asset: 'إضافة أصل جديد', asset_cur: 'عملة الأصل', qty: 'الكمية / المبلغ', update_port: 'تحديث المحفظة',
    watchlist_empty: 'قائمة المراقبة فارغة', click_to_track: 'انقر على النجمة للتتبع', tracked: 'متبع', quick_access: 'وصول سريع لـ',
    live: 'مباشر', nodes: 'العقد العالمية', nominal: 'اسمي', sync_real: 'الوقت الحقيقي', compliance: 'الامتثال',
    perf: 'أداء النظام', latency: 'زمن انتقال الشبكة', node_status: 'حالة عقدة API', active_primary: 'نشط-أساسي',
    rights: 'جميع الحقوق محفوظة • البيانات المقدمة من عقد الصرف المهنية', gateway: 'بوابة مؤسسية من المستوى الأول. شبكة عالمية بLatency ميلي ثانية',
    install_now: 'تثبيت الآن', search_cur: 'ابحث عن عملة أو بلد...', no_cur: 'لم يتم العثور على عملات',
    welcome: 'مرحباً بعودتك', create_acc: 'إنشاء حساب', login_sub: 'سجل الدخول بأمان لإدارة محافظ العملات العالمية الخاصة بك.',
    signup_sub: 'انضم إلى CurrencyEx للحصول على أسعار فورية وتنبيهات مخصصة.', full_name: 'الاسم الكامل', email: 'البريد الإلكتروني',
    password: 'كلمة المرور', secure_login: 'تسجيل دخول آمن', create_prof: 'إنشاء ملف تعريف', or_continue: 'أو الاستمرار بـ',
    new_here: 'جديد في CurrencyEx؟', have_acc: 'لديك حساب بالفعل؟', login: 'تسجيل الدخول', last_sync: 'آخر مزامنة',
    solutions: 'حلول', resources: 'موارد', legal: 'قانوني', terms: 'شروط الخدمة', privacy: 'سياسة الخصوصية', 
    spot: 'تداول فوري', api_node: 'توصيل API', institutional: 'المركز المؤسسي', dev_hub: 'مركز المطورين', help: 'مركز المساعدة'
  },
  es: {
    portal: 'Portal Institucional', access: 'Acceso Portal', intel: 'Centro Inteligencia', traders: 'Operadores',
    clock: 'Reloj Sistema (GMT)', history: 'Historial Tasas', favorites: 'Lista Vigilancia',
    strength: 'Fuerza Divisa', heatmap: 'Mapa de Calor', multiGrid: 'Rejilla Global',
    conv_tool: 'Conversor', enter_amt: 'Monto', from: 'De', to: 'A', live_flow: 'Flujo en Vivo',
    bank_fee: '+2% Comisión', sync: 'Sinc', rate: 'Tasa', alert_set: 'Alerta fijada', notify: 'Notificarme',
    ext_intel: 'Inteligencia Mercado', news_source: 'Fuente', fetching: 'Cargando Mercados...',
    headliner: 'Titular en Vivo', fin_update: 'Actualización Fin', volatility: 'Volatilidad',
    confidence: 'Confianza', history_ledger: 'Libro Historial', indicators: 'Indicadores',
    export: 'Exportar CSV', pulse: 'Pulso Económico', impact_high: 'Alto Impacto', impact_med: 'Medio',
    impact_low: 'Bajo', expert_tip: 'Consejo Experto', pwa_sync: 'Sincronizar', pwa_terminal: 'Terminal Pro',
    ai_ask: 'Preguntar AI', ai_greet: '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?',
    ai_placeholder: 'Pregunta lo que sea...', ai_note: 'La IA puede cometer errores', low_risk: 'Riesgo Bajo',
    portfolio: 'Cartera de Activos', track_holdings: 'Seguimiento Global', total_val: 'Valoración Total',
    active_holdings: 'Tenencias Activas', amount: 'Cantidad', holding: 'Tenencia', live_node: 'Datos de Nodo en Vivo',
    add_asset: 'Agregar Nuevo Activo', asset_cur: 'Moneda del Activo', qty: 'Cantidad / Monto', update_port: 'Actualizar Cartera',
    watchlist_empty: 'Lista de seguimiento vacía', click_to_track: 'Haz clic en la estrella para seguir', tracked: 'Siguiendo', quick_access: 'Acceso rápido para',
    live: 'En Vivo', nodes: 'Nodos Globales', nominal: 'Nominal', sync_real: 'Tiempo Real', compliance: 'Cumplimiento',
    perf: 'Rendimiento Sistema', latency: 'Latencia de Red', node_status: 'Estado Nodo API', active_primary: 'Activo-Primario',
    rights: 'Todos los derechos reservados • datos proporcionados por nodos profesionales', gateway: 'Pasarela institucional Nivel 1. Red global con latencia mínima',
    install_now: 'Instalar ahora', search_cur: 'Buscar moneda o país...', no_cur: 'No se encontraron monedas',
    welcome: 'Bienvenido de nuevo', create_acc: 'Crear cuenta', login_sub: 'Inicie sesión de forma segura para gestionar sus carteras de divisas globales.',
    signup_sub: 'Únase a CurrencyEx para obtener tasas en tiempo real y alertas personalizadas.', full_name: 'Nombre completo', email: 'Correo electrónico',
    password: 'Contraseña', secure_login: 'Iniciar sesión seguro', create_prof: 'Crear perfil', or_continue: 'O CONTINUAR CON',
    new_here: '¿Nuevo en CurrencyEx?', have_acc: '¿Ya tienes una cuenta?', login: 'Iniciar sesión', last_sync: 'Última sincronización',
    solutions: 'Soluciones', resources: 'Recursos', legal: 'Legal', terms: 'Términos de Servicio', privacy: 'Política de Privacidad', 
    spot: 'Trading al Contado', api_node: 'Conectividad API', institutional: 'Hub Institucional', dev_hub: 'Hub Desarrollador', help: 'Centro Ayuda'
  },
  fr: {
    portal: 'Portail Institutionnel', access: 'Accès Portail', intel: 'Centre IA Marché', traders: 'Négociants',
    clock: 'Horloge Système (GMT)', history: 'Historique', favorites: 'Liste Surveillance',
    strength: 'Force Devise', heatmap: 'Carte Thermique', multiGrid: 'Grille Global',
    conv_tool: 'Convertisseur', enter_amt: 'Montant', from: 'De', to: 'À', live_flow: 'Flux Direct',
    bank_fee: '+2% Frais Bank', sync: 'Sync', rate: 'Taux', alert_set: 'Alerte fixée', notify: 'M\'alerter',
    ext_intel: 'Intelligence Marché', news_source: 'Source', fetching: 'Chargement Marchés...',
    headliner: 'À la Une Direct', fin_update: 'Actu Financière', volatility: 'Volatilité',
    confidence: 'Confiance', history_ledger: 'Registre Historique', indicators: 'Indicateurs',
    export: 'Exporter CSV', pulse: 'Pouls Économique', impact_high: 'Impact Élevé', impact_med: 'Moyen',
    impact_low: 'Faible', expert_tip: 'Conseil Expert', pwa_sync: 'Synchroniser', pwa_terminal: 'Terminal Pro',
    ai_ask: 'Demander à IA', ai_greet: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?',
    ai_placeholder: 'Demandez n\'importe quoi...', ai_note: 'L\'IA peut faire des erreurs', low_risk: 'Risque Faible',
    portfolio: 'Portefeuille d\'actifs', track_holdings: 'Suivi des avoirs mondiaux', total_val: 'Valorisation totale',
    active_holdings: 'Avoirs actifs', amount: 'Montant', holding: 'Avoir', live_node: 'Données de nœud en direct',
    add_asset: 'Ajouter un actif', asset_cur: 'Devise de l\'actif', qty: 'Quantité / Montant', update_port: 'Mettre à jour le portefeuille',
    watchlist_empty: 'Liste de surveillance vide', click_to_track: 'Cliquez sur l\'étoile pour suivre', tracked: 'Suivi', quick_access: 'Accès rapide pour',
    live: 'Direct', nodes: 'Nœuds Mondiaux', nominal: 'Nominal', sync_real: 'Temps Réel', compliance: 'Conformité',
    perf: 'Performance Système', latency: 'Latence Réseau', node_status: 'Statut Nœud API', active_primary: 'Actif-Primaire',
    rights: 'Tous droits réservés • données fournies par des nœuds d\'échange professionnels', gateway: 'Passerelle institutionnelle de Niveau 1. Réseau mondial avec latence minimale',
    install_now: 'Installer maintenant', search_cur: 'Rechercher une devise ou un pays...', no_cur: 'Aucune devise trouvée',
    welcome: 'Content de vous revoir', create_acc: 'Créer un compte', login_sub: 'Connectez-vous en toute sécurité pour gérer vos portefeuilles de devises mondiaux.',
    signup_sub: 'Rejoignez CurrencyEx pour des taux en temps réel et des alertes personnalisées.', full_name: 'Nom complet', email: 'Adresse e-mail',
    password: 'Mot de passe', secure_login: 'Connexion sécurisée', create_prof: 'Créer un profil', or_continue: 'OU CONTINUER AVEC',
    new_here: 'Nouveau sur CurrencyEx ?', have_acc: 'Vous avez déjà un compte ?', login: 'Se connecter', last_sync: 'Dernière synchronisation',
    solutions: 'Solutions', resources: 'Ressources', legal: 'Légal', terms: 'Conditions de Service', privacy: 'Politique de Confidentialité', 
    spot: 'Trading au Comptant', api_node: 'Connectivité API', institutional: 'Hub Institutionnel', dev_hub: 'Hub Développeur', help: 'Centre Aide'
  },
  ur: {
    portal: 'ادارہ جاتی پورٹل', access: 'تک رسائی', intel: 'مارکیٹ انٹیلی جنس', traders: 'تاجر',
    clock: 'سسٹم کلاک (GMT)', history: 'شرح کی تاریخ', favorites: 'انٹیلی جنس واچ لسٹ',
    strength: 'کرنسی کی طاقت', heatmap: 'ہیٹ میپ', multiGrid: 'عالمی تبادلوں کا گرڈ',
    conv_tool: 'تبدیلی کا آلہ', enter_amt: 'رقم درج کریں', from: 'سے', to: 'تک', live_flow: 'براہ راست تبادلہ',
    bank_fee: '+2% بینک فیس', sync: 'سنک', rate: 'شرح', alert_set: 'الرٹ سیٹ', notify: 'مجھے مطلع کریں',
    ext_intel: 'مارکیٹ انٹیلی جنس', news_source: 'ذریعہ', fetching: 'مارکیٹیں لا رہے ہیں...',
    headliner: 'براہ راست سرخیاں', fin_update: 'مالیاتی اپ ڈیٹ', volatility: 'اتار چڑھاؤ',
    confidence: 'اعتماد', history_ledger: 'ادارہ جاتی ہسٹری لیجر', indicators: 'اشارے',
    export: 'ایکسپورٹ CSV', pulse: 'معاشی نبض', impact_high: 'زیادہ اثر', impact_med: 'درمیانہ',
    impact_low: 'کم', expert_tip: 'ماہرانہ مشورہ', pwa_sync: 'ایپ سنک', pwa_terminal: 'پرو ٹرمینل',
    ai_ask: 'AI سے پوچھیں', ai_greet: 'سلام! میں آپ کا AI اسسٹنٹ ہوں۔ آج میں کیسے مدد کر سکتا ہوں؟',
    ai_placeholder: 'کچھ بھی پوچھیں...', ai_note: 'AI جوابات غلط ہو سکتے ہیں', low_risk: 'کم خطرہ',
    portfolio: 'اثاثہ پورٹ فولیو', track_holdings: 'عالمی ہولڈنگز ٹریک کریں', total_val: 'کل مالیت',
    active_holdings: 'فعال ہولڈنگز', amount: 'رقم', holding: 'ہولڈنگ', live_node: 'لائیو نوڈ ڈیٹا',
    add_asset: 'نیا اثاثہ شامل کریں', asset_cur: 'اثاثہ کرنسی', qty: 'مقدار / رقم', update_port: 'پورٹ فولیو اپ ڈیٹ کریں',
    watchlist_empty: 'واچ لسٹ خالی ہے', click_to_track: 'ٹریک کرنے کے لیے اسٹار پر کلک کریں', tracked: 'ٹریک شدہ', quick_access: 'تک فوری رسائی',
    live: 'لائیو', nodes: 'عالمی نوڈس', nominal: 'برائے نام', sync_real: 'حقیقی وقت', compliance: 'تعمیل',
    perf: 'سسٹم کی کارکردگی', latency: 'نیٹ ورک کی تاخیر', node_status: 'API نوڈ کی حیثیت', active_primary: 'ایکٹو-پرائمری',
    rights: 'جملہ حقوق محفوظ ہیں • پیشہ ورانہ ایکسچینج نوڈس کے ذریعہ فراہم کردہ ڈیٹا', gateway: 'ٹیر-1 ادارہ جاتی گیٹ وے. ملی سیکنڈ لیٹنسی عالمی نیٹ ورک',
    install_now: 'ابھی انسٹال کریں', search_cur: 'کرنسی یا ملک تلاش کریں...', no_cur: 'کوئی کرنسی نہیں ملی',
    welcome: 'واپسی پر خوش آمدید', create_acc: 'اکاؤنٹ بنائیں', login_sub: 'اپنے عالمی کرنسی پورٹ فولیو کو منظم کرنے کے لیے محفوظ طریقے سے لاگ ان کریں۔',
    signup_sub: 'ریئل ٹائم ریٹس اور ذاتی انتباہات کے لیے CurrencyEx میں شامل ہوں۔', full_name: 'پورا نام', email: 'ایمیل ایڈریس',
    password: 'پاس ورڈ', secure_login: 'محفوظ لاگ ان', create_prof: 'پروفائل بنائیں', or_continue: 'یا اس کے ساتھ جاری رکھیں',
    new_here: 'CurrencyEx میں نئے ہیں؟', have_acc: 'پہلے سے اکاؤنٹ ہے؟', login: 'لاگ ان کریں', last_sync: 'آخری سنک',
    solutions: 'حل', resources: 'وسائل', legal: 'قانونی', terms: 'سروس کی شرائط', privacy: 'رازداری کی پالیسی', 
    spot: 'اسپاٹ ٹریڈنگ', api_node: 'API کنیکٹیویٹی', institutional: 'ادارہ جاتی مرکز', dev_hub: 'ڈیولپر مرکز', help: 'ہیلپ سینٹر'
  }
};

function App() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState('1');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const t = TRANSLATIONS[language];
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('currency-favorites');
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });
  const [timeframe, setTimeframe] = useState(7);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [liveUsers, setLiveUsers] = useState(1240);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Simulate live users fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-Detect User Location & Currency
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data && data.currency) {
          if (data.currency === 'INR') {
            setFromCurrency('USD');
            setToCurrency('INR');
          } else {
            setFromCurrency(data.currency);
            setToCurrency('INR');
          }
        }
      } catch (error) {
        console.log('Location auto-detect skipped (using defaults).');
      }
    };

    detectUserCurrency();
  }, []);

  // Handle PWA Install Prompt
  useEffect(() => {
    if (localStorage.getItem('pwa-dismissed') === 'true') return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setShowInstallBtn(false);
    setDeferredPrompt(null);
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-dismissed', 'true');
    }
  };

  const handleInstallDismiss = () => {
    setShowInstallBtn(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  const { data: historyData, loading: historyLoading } = useRateHistory(fromCurrency, toCurrency, timeframe);
  const { data: currentRatesData } = useCurrencyRates(fromCurrency);
  const allRates = currentRatesData?.rates || {};

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('currency-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (from, to) => {
    const exists = favorites.find(f => f.from === from && f.to === to);
    if (exists) {
      setFavorites(favorites.filter(f => !(f.from === from && f.to === to)));
    } else {
      setFavorites([...favorites, { from, to }]);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-700 font-sans relative">

      {/* Subtle PWA Install Pulse */}
      {showInstallBtn && (
        <div className="fixed top-24 right-6 z-[100] animate-in fade-in slide-in-from-right-5 duration-700">
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative flex items-center gap-3 p-3 bg-white dark:bg-[#12141c] rounded-2xl border border-indigo-500/10 shadow-2xl">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Zap className="text-white" size={14} fill="currentColor" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">{t.pwa_sync}</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 leading-none">{t.pwa_terminal}</span>
              </div>
              <div className="flex items-center gap-1 border-l border-gray-100 dark:border-white/5 pl-2">
                <button
                  onClick={handleInstallClick}
                  className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors"
                  title={t.install_now || 'Install Now'}
                >
                  <Activity size={14} />
                </button>
                <button 
                  onClick={handleInstallDismiss}
                  className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 dark:bg-violet-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Premium Navbar */}
      <nav className="relative z-50 px-6 py-5 bg-white/70 dark:bg-[#0a0c10]/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 sticky top-0">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-transform group-hover:rotate-12">
              <Sparkles className="text-white" size={22} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                Currency<span className="text-indigo-600">Ex</span>
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
                  {t.portal}
                </span>
              </div>
            </div>
          </div>
          
          {/* Mobile Actions Overlay */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Quick Actions Bar - Mobile */}
            <div className="flex items-center gap-1 bg-gray-50/50 dark:bg-[#12141c] p-1 rounded-2xl border border-gray-100 dark:border-white/5">
              <button className="p-2 text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                <Activity size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                <TrendingUp size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                <Newspaper size={16} />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`p-2.5 rounded-2xl transition-all active:scale-95 border ${
                  showLangMenu 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' 
                    : 'bg-gray-50/50 dark:bg-[#12141c] text-indigo-500 border-gray-100 dark:border-white/5'
                }`}
              >
                <Globe size={18} />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-[#12141c] rounded-4xl border border-gray-100 dark:border-white/5 shadow-2xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1 space-y-1">
                    {[
                      { code: 'en', label: 'English', sub: 'Global' },
                      { code: 'hi', label: 'हिंदी', sub: 'India' },
                      { code: 'ar', label: 'العربية', sub: 'MENA' },
                      { code: 'es', label: 'Español', sub: 'LatAm' },
                      { code: 'fr', label: 'Français', sub: 'Europe' },
                      { code: 'ur', label: 'اردو', sub: 'Pakistan' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-2xl text-left transition-all ${
                          language === lang.code 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`${language === lang.code ? 'text-white' : 'text-gray-900 dark:text-white'} text-[10px] font-black uppercase tracking-widest`}>
                            {lang.label}
                          </span>
                          <span className={`${language === lang.code ? 'text-indigo-200' : 'text-gray-400'} text-[7px] font-black uppercase tracking-[0.2em] mt-0.5`}>
                            {lang.sub}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-4">
              <Activity size={18} className="text-indigo-500" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.traders}</span>
                <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{liveUsers.toLocaleString()}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200 dark:bg-gray-800"></div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.clock}</span>
              <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                {currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <div className="h-10 w-px bg-gray-200 dark:bg-gray-800"></div>

            {/* Quick Actions Bar - PC */}
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#12141c] p-1.5 rounded-2xl border border-gray-100 dark:border-white/5">
              <button className="flex items-center gap-2 px-3 py-2 text-indigo-600 bg-white dark:bg-indigo-500/10 rounded-xl shadow-sm border border-transparent dark:border-indigo-500/20">
                <Activity size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.live}</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all" title={t.history}>
                <TrendingUp size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all" title={t.ext_intel}>
                <Newspaper size={16} />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all active:scale-95 border ${
                  showLangMenu 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' 
                    : 'bg-gray-50 dark:bg-[#12141c] text-indigo-500 border-gray-100 dark:border-white/5'
                }`}
              >
                <Globe size={18} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${showLangMenu ? 'text-white' : 'text-gray-400'}`}>
                  {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : language === 'ar' ? 'العربية' : language === 'es' ? 'Español' : language === 'fr' ? 'Français' : 'اردو'}
                </span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#12141c] rounded-4xl border border-gray-100 dark:border-white/5 shadow-2xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1.5 space-y-1">
                    {[
                      { code: 'en', label: 'English', sub: 'Global Market' },
                      { code: 'hi', label: 'हिंदी', sub: 'Indian Market' },
                      { code: 'ar', label: 'العربية', sub: 'MENA Region' },
                      { code: 'es', label: 'Español', sub: 'Mercado LatAm' },
                      { code: 'fr', label: 'Français', sub: 'Europe Centrale' },
                      { code: 'ur', label: 'اردو', sub: 'Pakistan/India' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3.5 rounded-2xl text-left transition-all ${
                          language === lang.code 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-black' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`${language === lang.code ? 'text-white' : 'text-gray-900 dark:text-white'} text-[11px] font-black uppercase tracking-widest`}>
                            {lang.label}
                          </span>
                          <span className={`${language === lang.code ? 'text-indigo-200' : 'text-gray-400'} text-[8px] font-black uppercase tracking-[0.2em] mt-1`}>
                            {lang.sub}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => setUser(null)}
                  className="w-11 h-11 rounded-3xl bg-linear-to-br from-indigo-600 to-violet-700 border-2 border-white dark:border-gray-800 shadow-xl flex items-center justify-center text-white font-black text-sm"
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <UserIcon size={16} />
                {t.access}
              </button>
            )}
          </div>
        </div>
      </nav>

      <LiveTicker t={t} />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          <CurrencyConverter
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            setFromCurrency={setFromCurrency}
            setToCurrency={setToCurrency}
            amount={amount}
            setAmount={setAmount}
            toggleFavorite={user ? toggleFavorite : null}
            isFavorite={favorites.some(f => f.from === fromCurrency && f.to === toCurrency)}
            t={t}
          />

          <HistoryChart
            data={historyData}
            loading={historyLoading}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            t={t}
          />

          <SavedFavorites 
            user={user}
            favorites={favorites}
            onRemove={(pair) => toggleFavorite(pair.from, pair.to)}
            onSelect={(from, to) => {
              setFromCurrency(from);
              setToCurrency(to);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            t={t}
          />

          <div className="space-y-6 pt-12 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{t.intel}</h3>
            </div>
            
            <MultiCurrencyGrid 
               amount={amount} 
               rates={allRates} 
               baseCurrency={fromCurrency} 
               t={t}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <CurrencyStrength t={t} />
               <CorrelationHeatmap t={t} />
            </div>
            
            <PortfolioTracker 
              rates={allRates} 
              baseCurrency={fromCurrency} 
              t={t}
            />
            
            <EconomicCalendar t={t} />
          </div>

          </div>
      </main>

      <MarketNews t={t} />
      <AIChatbot t={t} />

      {/* Professional Institutional Footer */}
      <footer className="relative z-10 bg-white dark:bg-[#0a0c10] border-t border-gray-100 dark:border-white/5 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 pb-20">
            {/* Branding Column */}
            <div className="col-span-2 lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                  <Sparkles className="text-white" size={20} fill="currentColor" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white">Currency<span className="text-indigo-600">Ex</span></span>
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
                Experience millisecond latency and Tier-1 institutional connectivity. 
                Our gateway provides real-time access to professional exchange nodes and 
                global liquidity pools for sophisticated traders.
              </p>
            </div>

            {/* Solutions Column */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{t.solutions}</h4>
              <ul className="space-y-4">
                {[
                  { name: t.spot, url: '#' },
                  { name: t.api_node, url: '#' },
                  { name: t.institutional, url: '#' }
                ].map(link => (
                  <li key={link.name}>
                    <a href={link.url} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{t.resources}</h4>
              <ul className="space-y-4">
                {[
                  { name: t.dev_hub, url: '#' },
                  { name: t.help, url: '#' },
                  { name: t.news, url: '#' }
                ].map(link => (
                  <li key={link.name}>
                    <a href={link.url} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{t.legal}</h4>
              <ul className="space-y-4">
                {[
                  { name: t.terms, url: '#' },
                  { name: t.privacy, url: '#' },
                  { name: t.compliance, url: '#' }
                ].map(link => (
                  <li key={link.name}>
                    <a href={link.url} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Status and Copyright */}
          <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t.node_status}:</span>
                <span className="text-[11px] font-black text-emerald-500 uppercase">{t.active_primary}</span>
              </div>
              <div className="w-px h-4 bg-gray-100 dark:bg-gray-800 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-indigo-500" />
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t.latency}:</span>
                <span className="text-[11px] font-black text-indigo-600">142MS</span>
              </div>
              <div className="w-px h-4 bg-gray-100 dark:bg-gray-800 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <History size={12} className="text-gray-400" />
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t.last_sync}:</span>
                <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase">{t.sync_real}</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              © 2026 CurrencyEx • {t.rights}
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={(userData) => setUser(userData)}
        t={t}
      />
    </div>
  );
}

export default App;
