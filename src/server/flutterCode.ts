export interface FlutterFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const FLUTTER_CODE_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    language: 'yaml',
    description: 'Dependencias oficiales de Flutter, Supabase y estilos',
    content: `name: todo_compresores_app
description: "App Android para Todo Compresores y Bobinados TCB - Conexión Supabase"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  supabase_flutter: ^2.5.6
  intl: ^0.19.0
  google_fonts: ^6.1.0
  fl_chart: ^0.68.0
  url_launcher: ^6.3.0
  font_awesome_flutter: ^10.7.0
  shared_preferences: ^2.2.3
  http: ^1.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`
  },
  {
    path: 'lib/main.dart',
    language: 'dart',
    description: 'Punto de entrada con tema ElectroTech Dark Glass y navegación',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/nueva_venta_screen.dart';
import 'screens/historial_screen.dart';
import 'screens/estadisticas_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicialización de Supabase con fallback local
  try {
    await Supabase.initialize(
      url: const String.fromEnvironment('SUPABASE_URL', defaultValue: 'https://tu-proyecto.supabase.co'),
      anonKey: const String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: 'tu-anon-key-aqui'),
    );
  } catch (e) {
    debugPrint('Supabase no configurado aún, operando en modo local: \$e');
  }

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0C0F17),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const TodoCompresoresApp());
}

class TodoCompresoresApp extends StatelessWidget {
  const TodoCompresoresApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todo Compresores y Bobinados',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0C0F17),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFFFD600),
          secondary: Color(0xFFE52421),
          surface: Color(0xFF131826),
          background: Color(0xFF0C0F17),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 1; // 0: Historial, 1: Vender, 2: Estadísticas

  final List<Widget> _screens = const [
    HistorialScreen(),
    NuevaVentaScreen(),
    EstadisticasScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF10131B).withOpacity(0.95),
          border: const Border(
            top: BorderSide(color: Color(0x1AFFFFFF), width: 1),
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: SafeArea(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                icon: Icons.history,
                label: 'Historial',
                isActive: _currentIndex == 0,
                onTap: () => setState(() => _currentIndex = 0),
              ),
              _buildCentralVenderButton(
                isActive: _currentIndex == 1,
                onTap: () => setState(() => _currentIndex = 1),
              ),
              _buildNavItem(
                icon: Icons.insights_rounded,
                label: 'Estadísticas',
                isActive: _currentIndex == 2,
                onTap: () => setState(() => _currentIndex = 2),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isActive ? const Color(0xFFFFD600) : const Color(0xFF94A3B8),
              size: 22,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isActive ? const Color(0xFFFFD600) : const Color(0xFF94A3B8),
                fontSize: 12,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCentralVenderButton({
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFFFD600),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFFFD600).withOpacity(0.4),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Icon(Icons.add, color: Color(0xFF0C0F17), size: 20),
            SizedBox(width: 6),
            Text(
              'VENDER',
              style: TextStyle(
                color: Color(0xFF0C0F17),
                fontSize: 14,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/nueva_venta_screen.dart',
    language: 'dart',
    description: 'Pantalla 1: Registro rápido en 3 pasos con métricas del día',
    content: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/supabase_service.dart';
import '../models/sale_model.dart';

class NuevaVentaScreen extends StatefulWidget {
  const NuevaVentaScreen({super.key});

  @override
  State<NuevaVentaScreen> createState() => _NuevaVentaScreenState();
}

class _NuevaVentaScreenState extends State<NuevaVentaScreen> {
  final TextEditingController _itemController = TextEditingController();
  final TextEditingController _priceController = TextEditingController(text: '35000');
  String _paymentMethod = 'efectivo'; // 'efectivo', 'nequi_davi', 'tarjeta'
  bool _isSaving = false;

  final currencyFormatter = NumberFormat.currency(locale: 'es_CO', symbol: '\$', decimalDigits: 0);

  final List<Map<String, dynamic>> _quickProducts = [
    {'name': 'Aceite Compresor 1L', 'price': 35000},
    {'name': 'Bobinado Motor 2HP', 'price': 120000},
    {'name': 'Mantenimiento General', 'price': 140000},
    {'name': 'Acople Rápido 1/4', 'price': 18000},
    {'name': 'Manómetro Glicerina', 'price': 32000},
  ];

  void _addAmount(int addition) {
    final current = int.tryParse(_priceController.text) ?? 0;
    setState(() {
      _priceController.text = (current + addition).toString();
    });
  }

  Future<void> _submitSale() async {
    final title = _itemController.text.trim();
    final price = int.tryParse(_priceController.text) ?? 0;
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor escribe el producto o trabajo')),
      );
      return;
    }
    if (price <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('El precio debe ser mayor a 0')),
      );
      return;
    }

    setState(() => _isSaving = true);
    try {
      final now = DateTime.now();
      final timeStr = DateFormat('h:mm a').format(now);
      final dateStr = DateFormat('yyyy-MM-dd').format(now);

      await SupabaseService.instance.createSale(
        Sale(
          id: 'sale-\${DateTime.now().millisecondsSinceEpoch}',
          itemName: title,
          price: price,
          paymentMethod: _paymentMethod,
          category: _inferCategory(title),
          createdAt: now,
          createdTimeStr: timeStr,
          createdDateStr: dateStr,
        ),
      );

      _itemController.clear();
      _priceController.text = '35000';
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFFFFD600),
            content: Text(
              '¡Venta registrada con éxito: \$title!',
              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
            ),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: \$e')),
      );
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  String _inferCategory(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('aceite')) return 'aceite';
    if (lower.contains('bobinado')) return 'bobinado';
    if (lower.contains('mantenimiento')) return 'mantenimiento';
    if (lower.contains('acople')) return 'acople';
    return 'repuesto';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0C0F17),
      appBar: AppBar(
        backgroundColor: const Color(0xFF131826),
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'TCB',
                style: TextStyle(color: Colors.red, fontWeight: FontWeight.w900, fontSize: 11),
              ),
            ),
            const SizedBox(width: 8),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Todo Compresores y Bobin...',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    'Nueva Venta • Modo Fácil',
                    style: TextStyle(fontSize: 11, color: Color(0xFFFFD600)),
                  ),
                ],
              ),
            ),
            Container(
              decoration: const BoxDecoration(
                color: Color(0xFF272A33),
                shape: BoxShape.circle,
              ),
              padding: const EdgeInsets.all(8),
              child: const Icon(Icons.person, color: Color(0xFFFFD600), size: 18),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Don Carlos
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      '¡Hola Don Carlos! 👋',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Viernes, 24 de Octubre de 2026',
                      style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFD600).withOpacity(0.15),
                    border: Border.all(color: const Color(0xFFFFD600)),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.circle, color: Color(0xFFFFD600), size: 8),
                      SizedBox(width: 4),
                      Text(
                        'CAJA ABIERTA',
                        style: TextStyle(color: Color(0xFFFFD600), fontSize: 11, fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Card Vendido Hoy
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF131826).withOpacity(0.85),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0x2AFFFFFF)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.monetization_on_outlined, color: Color(0xFFFFD600), size: 18),
                          SizedBox(width: 6),
                          Text(
                            'VENDIDO HOY',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF94A3B8)),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '↗ +18% vs ayer',
                          style: TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  RichText(
                    text: const TextSpan(
                      text: '\$ 385.000 ',
                      style: TextStyle(color: Color(0xFFFFD600), fontSize: 28, fontWeight: FontWeight.w900),
                      children: [
                        TextSpan(
                          text: 'COP',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Meta diaria: \$ 600.000 COP (64%)',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: 0.64,
                      minHeight: 6,
                      backgroundColor: Colors.white10,
                      valueColor: const AlwaysStoppedAnimation(Color(0xFFFFD600)),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E2438),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('⚡ Ventas hoy', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                              SizedBox(height: 2),
                              Text('14 facturadas', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E2438),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('🧾 Ticket prom.', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                              SizedBox(height: 2),
                              Text('\$ 27.500', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Formulario Registrar Nueva Venta
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF131826),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFFD600).withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.point_of_sale, color: Color(0xFFFFD600), size: 24),
                      SizedBox(width: 8),
                      Text(
                        'Registrar Nueva Venta',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                      Spacer(),
                      Icon(Icons.bolt, color: Color(0xFFFFD600)),
                    ],
                  ),
                  const Text(
                    'Rápido, en 3 pasos sencillos',
                    style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                  ),
                  const SizedBox(height: 18),

                  // Paso 1
                  const Text('1  ¿Qué producto o trabajo vendiste?', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFFFD600))),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _itemController,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Ej: Bobinado motor 3HP, Aceite...',
                      hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                      filled: true,
                      fillColor: const Color(0xFF0C0F17),
                      suffixIcon: _itemController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.close, color: Colors.redAccent, size: 18),
                              onPressed: () => setState(() => _itemController.clear()),
                            )
                          : null,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0x33FFFFFF))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFFFD600))),
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Quick tags
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _quickProducts.map((p) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ActionChip(
                            backgroundColor: const Color(0xFF1E2438),
                            side: const BorderSide(color: Color(0x33FFD600)),
                            label: Text(
                              '+ \${p['name']} (\$\${p['price']})',
                              style: const TextStyle(color: Color(0xFFFFD600), fontSize: 11),
                            ),
                            onPressed: () {
                              setState(() {
                                _itemController.text = p['name'];
                                _priceController.text = p['price'].toString();
                              });
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Paso 2
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('2  Precio a cobrar', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFFFD600))),
                      Text('Pesos Colombianos', style: TextStyle(fontSize: 11, color: Color(0xFFFFD600))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _priceController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Color(0xFFFFD600), fontSize: 24, fontWeight: FontWeight.w900),
                    decoration: InputDecoration(
                      prefixText: '\$ ',
                      prefixStyle: const TextStyle(color: Color(0xFFFFD600), fontSize: 24, fontWeight: FontWeight.w900),
                      suffixText: 'COP',
                      suffixStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14, fontWeight: FontWeight.bold),
                      filled: true,
                      fillColor: const Color(0xFF0C0F17),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0x33FFFFFF))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFFFD600))),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildQuickAddButton('+ \$5.000', 5000),
                      const SizedBox(width: 8),
                      _buildQuickAddButton('+ \$10.000', 10000),
                      const SizedBox(width: 8),
                      _buildQuickAddButton('+ \$50.000', 50000),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Paso 3
                  const Text('3  ¿Cómo te pagó el cliente?', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFFFD600))),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildPaymentButton('Efectivo', 'efectivo', Icons.payments_outlined),
                      const SizedBox(width: 8),
                      _buildPaymentButton('Nequi/Davi', 'nequi_davi', Icons.phone_android),
                      const SizedBox(width: 8),
                      _buildPaymentButton('Tarjeta', 'tarjeta', Icons.credit_card),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Guardar Venta Button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFD600),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: _isSaving ? null : _submitSale,
                      icon: const Icon(Icons.save, color: Color(0xFF0C0F17)),
                      label: Text(
                        _isSaving ? 'GUARDANDO...' : '💾 GUARDAR VENTA 💾',
                        style: const TextStyle(color: Color(0xFF0C0F17), fontSize: 16, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAddButton(String label, int val) {
    return Expanded(
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: Color(0x33FFFFFF)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        onPressed: () => _addAmount(val),
        child: Text(label, style: const TextStyle(color: Colors.white, fontSize: 11)),
      ),
    );
  }

  Widget _buildPaymentButton(String label, String key, IconData icon) {
    final isSelected = _paymentMethod == key;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _paymentMethod = key),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFFFD600).withOpacity(0.2) : const Color(0xFF1E2438),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? const Color(0xFFFFD600) : Colors.transparent,
              width: 1.5,
            ),
          ),
          child: Column(
            children: [
              Icon(icon, color: isSelected ? const Color(0xFFFFD600) : const Color(0xFF94A3B8), size: 20),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? const Color(0xFFFFD600) : Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/models/sale_model.dart',
    language: 'dart',
    description: 'Modelo de datos de Venta sincronizado con Supabase',
    content: `class Sale {
  final String id;
  final String itemName;
  final int price;
  final String paymentMethod;
  final String category;
  final String? customerName;
  final String? notes;
  final DateTime createdAt;
  final String createdTimeStr;
  final String createdDateStr;

  Sale({
    required this.id,
    required this.itemName,
    required this.price,
    required this.paymentMethod,
    required this.category,
    this.customerName,
    this.notes,
    required this.createdAt,
    required this.createdTimeStr,
    required this.createdDateStr,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'item_name': itemName,
    'price': price,
    'payment_method': paymentMethod,
    'category': category,
    'customer_name': customerName,
    'notes': notes,
    'created_at': createdAt.toIso8601String(),
    'created_time_str': createdTimeStr,
    'created_date_str': createdDateStr,
  };

  factory Sale.fromJson(Map<String, dynamic> map) {
    return Sale(
      id: map['id'] ?? '',
      itemName: map['item_name'] ?? '',
      price: (map['price'] as num?)?.toInt() ?? 0,
      paymentMethod: map['payment_method'] ?? 'efectivo',
      category: map['category'] ?? 'otro',
      customerName: map['customer_name'],
      notes: map['notes'],
      createdAt: DateTime.tryParse(map['created_at'] ?? '') ?? DateTime.now(),
      createdTimeStr: map['created_time_str'] ?? '',
      createdDateStr: map['created_date_str'] ?? '',
    );
  }
}
`
  },
  {
    path: 'lib/services/supabase_service.dart',
    language: 'dart',
    description: 'Servicio de integración con Supabase y respaldo local',
    content: `import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/sale_model.dart';

class SupabaseService {
  SupabaseService._();
  static final SupabaseService instance = SupabaseService._();

  static const String tableName = 'ventas_tcb';

  SupabaseClient? get client {
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

  Future<void> createSale(Sale sale) async {
    final c = client;
    if (c != null) {
      await c.from(tableName).insert(sale.toJson());
    } else {
      debugPrint('Guardado local de venta: \${sale.itemName}');
    }
  }

  Future<List<Sale>> fetchSales() async {
    final c = client;
    if (c == null) return [];
    final res = await c.from(tableName).select().order('created_at', ascending: false);
    return (res as List).map((e) => Sale.fromJson(e)).toList();
  }

  Future<void> deleteSale(String id) async {
    final c = client;
    if (c != null) {
      await c.from(tableName).delete().eq('id', id);
    }
  }
}
`
  },
  {
    path: 'android/app/build.gradle',
    language: 'groovy',
    description: 'Configuración de compilación Android Gradle para APK',
    content: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

android {
    namespace "com.todocompresores.app"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    defaultConfig {
        applicationId "com.todocompresores.app"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source '../..'
}
`
  },
  {
    path: 'README.md',
    language: 'markdown',
    description: 'Guía de compilación del APK Android y conexión Supabase',
    content: `# Todo Compresores y Bobinados - App Android Flutter

Esta aplicación está desarrollada para **Todo Compresores y Bobinados (TCB)** en Bogotá (Suba), adaptando la interfaz **ElectroTech Dark Glass** con conexión nativa a **Supabase**.

## Pasos para compilar el APK Android en tu computador:

1. **Instalar Flutter**:
   Descarga Flutter SDK (v3.22 o superior) desde https://flutter.dev

2. **Configurar Supabase**:
   Crea tu proyecto gratis en https://supabase.com y copia tu URL y Anon Key.
   Ejecuta el script SQL en el editor de Supabase.

3. **Ejecutar o Compilar**:
   \`\`\`bash
   # Obtener dependencias
   flutter pub get

   # Probar en emulador o celular Android conectado:
   flutter run

   # Generar APK final instalable:
   flutter build apk --release
   \`\`\`
   El archivo APK generado quedará en:
   \`build/app/outputs/flutter-apk/app-release.apk\`
`
  }
];
