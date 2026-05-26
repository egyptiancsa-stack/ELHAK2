import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.map': 'Africa Map',
    'nav.data': 'Data Center',
    'nav.reports': 'Reports Export',
    'nav.settings': 'System Settings',
    'nav.title': 'Data Navigation',
    'status.title': 'System Status',
    'status.online': 'Analytics Engine Online',
    'header.search': 'Search countries, indicators...',
    'header.active': 'SYSTEM ACTIVE',
    'dash.title': 'Executive Dashboard',
    'dash.subtitle': 'Real-time overview of African human rights indicators and democracy scores.',
    'kpi.index': 'Continental HR Index',
    'kpi.alerts': 'High Risk Alerts',
    'kpi.improving': 'Improving Trajectory',
    'kpi.monitored': 'Monitored Countries',
    'dash.extremes': 'Extremes Analysis: Democracy Index',
    'dash.detailed': 'Detailed View',
    'dash.global': 'Global HR Index',
    'dash.recorded': 'RECORDED',
    'dash.activity': 'Recent Activity',
    'dash.view_all': 'VIEW FULL LIST',
    'dash.trend_title': 'Historical Democracy Trends (2020-2024)',
    'set.title': 'System Settings',
    'set.subtitle': 'Application configuration, integrations, and preferences.',
    'set.general': 'General Settings',
    'set.lang': 'Interface Language',
    'set.theme': 'System Theme',
    'set.integration': 'Integrations',
    'set.wp_url': 'WordPress Site URL',
    'set.wp_key': 'REST API Application Password',
    'set.sync': 'Sync Status',
    'set.save': 'Save Configuration',
    'set.saved': 'Settings saved successfully',
    'map.title': 'Interactive Continental Analytics',
    'map.subtitle': 'Geospatial distribution of human rights and democracy indices across Africa.',
    'map.legend': 'Score Legend',
    'map.excellent': 'Excellent',
    'map.very_good': 'Very Good',
    'map.good': 'Good',
    'map.acceptable': 'Acceptable',
    'map.very_weak': 'Very Weak',
    'country.back': 'Back to Dashboard',
    'country.profile': 'National Human Rights Profile',
    'country.generating': 'GENERATING AI...',
    'country.generate': 'GENERATE REPORT',
    'country.export': 'EXPORT HTML',
    'country.trend': 'Historical Democracy Trend (2020 - 2024)',
    'country.ai_summary': 'AI Executive Summary',
    'country.core_indicators': 'Core Indicators',
    'country.scores_out_of': 'Component scores out of 100',
    'country.overall': 'Overall Democracy Score',
    'country.press': 'Press Freedom',
    'country.judicial': 'Judicial Independence',
    'country.civil': 'Civil Liberties',
    'country.political': 'Political Rights',
    'country.export_title': 'EXPORT AI ANNUAL REPORT',
    'country.export_desc': 'Complete Country Analysis for 2024',
    'country.download': 'DOWNLOAD PDF',
    'country.year': 'Year',
    'country.score': 'Score',
    'country.peak': 'Historical Peak',
    'country.trough': 'Historical Trough',
    'dash.compare': 'Country Comparison',
    'dash.select_c1': 'Select First Country',
    'dash.select_c2': 'Select Second Country',
    'dash.vs': 'VS',
    'indicator.structural': 'Structural Indicators',
    'indicator.process': 'Process Indicators',
    'indicator.outcome': 'Outcome Indicators',
    'category.civilPolitical': 'Civil and Political Rights',
    'category.opinionExpression': 'Freedom of Opinion and Expression',
    'category.economicSocial': 'Economic and Social Rights',
    'category.vulnerableGroups': 'Rights of Vulnerable Groups',
    'category.assemblyOrganization': 'Right to Assembly and Organization',
    'category.justice': 'Right to Justice',
    'country.main_dimensions': 'Main Dimensions Scores',
    'country.categories': 'Performance by Categories',
    'data.title': 'Data Center',
    'data.search': 'Search by country or region...',
    'data.country': 'Country',
    'data.region': 'Region',
    'data.actions': 'Actions',
    'data.edit': 'Edit Data',
    'data.no_results': 'No countries found matching the search.',
    'data.editing': 'Editing Data:',
    'data.saved': 'DATA SAVED',
    'data.error': 'SAVE FAILED',
    'data.cancel': 'CANCEL',
    'data.saving': 'SAVING...',
    'data.save': 'SAVE CHANGES',
    'data.upload_excel': 'UPLOAD EXCEL',
    'reports.title': 'Report Export Center',
    'reports.subtitle': 'Generate comprehensive or country-specific human rights reports.',
    'reports.single': 'Single Country Report',
    'reports.single_desc': 'Generate a detailed analysis for a specific nation.',
    'reports.collective': 'Collective Continental Report',
    'reports.collective_desc': 'Generate a continental overview and regional comparisons.',
    'reports.select_country': 'Select a country...',
    'reports.generate_pdf': 'GENERATE PDF',
    'reports.generate_html': 'GENERATE HTML',
    'reports.generate_csv': 'GENERATE CSV',
    'reports.generate_docx': 'GENERATE WORD',
    'reports.generating': 'GENERATING...',
    'reports.success': 'REPORT READY'
  },
  ar: {
    'nav.dashboard': 'لوحة القيادة',
    'nav.map': 'خريطة أفريقيا',
    'nav.data': 'مركز البيانات',
    'nav.reports': 'تصدير التقارير',
    'nav.settings': 'إعدادات النظام',
    'nav.title': 'تصفح البيانات',
    'status.title': 'حالة النظام',
    'status.online': 'محرك التحليلات متصل',
    'header.search': 'ابحث عن الدول، المؤشرات...',
    'header.active': 'النظام نشط',
    'dash.title': 'لوحة القيادة التنفيذية',
    'dash.subtitle': 'نظرة عامة في الوقت الفعلي لمؤشرات حقوق الإنسان والديمقراطية الأفريقية.',
    'kpi.index': 'المؤشر القاري لحقوق الإنسان',
    'kpi.alerts': 'تنبيهات عالية المخاطر',
    'kpi.improving': 'مسار التحسن',
    'kpi.monitored': 'الدول المراقبة',
    'dash.extremes': 'تحليل التطرف: مؤشر الديمقراطية',
    'dash.detailed': 'عرض تفصيلي',
    'dash.global': 'المؤشر العالمي',
    'dash.recorded': 'مسجل',
    'dash.activity': 'النشاط الأخير',
    'dash.view_all': 'عرض القائمة كاملة',
    'dash.trend_title': 'الاتجاهات التاريخية للديمقراطية (2020-2024)',
    'set.title': 'إعدادات النظام',
    'set.subtitle': 'تكوينات التطبيق وعمليات الدمج والتفضيلات.',
    'set.general': 'الإعدادات العامة',
    'set.lang': 'لغة الواجهة',
    'set.theme': 'مظهر النظام',
    'set.integration': 'عمليات الربط',
    'set.wp_url': 'رابط موقع ووردبريس',
    'set.wp_key': 'كلمة مرور تطبيق ووردبريس (REST API)',
    'set.sync': 'حالة المزامنة',
    'set.save': 'حفظ التكوين',
    'set.saved': 'تم حفظ الإعدادات بنجاح',
    'map.title': 'التحليلات القارية التفاعلية',
    'map.subtitle': 'التوزيع الجغرافي المكاني لمؤشرات حقوق الإنسان والديمقراطية في جميع أنحاء أفريقيا.',
    'map.legend': 'مفتاح النتائج',
    'map.excellent': 'ممتاز',
    'map.very_good': 'جيد جداً',
    'map.good': 'جيد',
    'map.acceptable': 'مقبول',
    'map.very_weak': 'ضعيف جداً',
    'country.back': 'العودة إلى اللوحة',
    'country.profile': 'الملف الوطني لحقوق الإنسان',
    'country.generating': 'جاري التحليل...',
    'country.generate': 'إنشاء تقرير',
    'country.export': 'تصدير HTML',
    'country.trend': 'الاتجاه التاريخي للديمقراطية (2020 - 2024)',
    'country.ai_summary': 'ملخص تنفيذي بالذكاء الاصطناعي',
    'country.core_indicators': 'المؤشرات الأساسية',
    'country.scores_out_of': 'درجات المكونات من 100',
    'country.overall': 'المؤشر الكلي للديمقراطية',
    'country.press': 'حرية الصحافة',
    'country.judicial': 'استقلال القضاء',
    'country.civil': 'الحريات المدنية',
    'country.political': 'الحقوق السياسية',
    'country.export_title': 'تصدير التقرير السنوي',
    'country.export_desc': 'تحليل كامل للدولة لعام 2024',
    'country.download': 'تحميل PDF',
    'country.year': 'السنة',
    'country.score': 'الدرجة',
    'country.peak': 'ذروة تاريخية',
    'country.trough': 'حضيض تاريخي',
    'dash.compare': 'مقارنة الدول',
    'dash.select_c1': 'اختر الدولة الأولى',
    'dash.select_c2': 'اختر الدولة الثانية',
    'dash.vs': 'ضد',
    'indicator.structural': 'المؤشرات الهيكلية',
    'indicator.process': 'مؤشرات العمليات',
    'indicator.outcome': 'مؤشرات النتائج',
    'category.civilPolitical': 'الحقوق المدنية والسياسية',
    'category.opinionExpression': 'حرية الرأي والتعبير',
    'category.economicSocial': 'الحقوق الاقتصادية والاجتماعية',
    'category.vulnerableGroups': 'حقوق الفئات المستضعفة',
    'category.assemblyOrganization': 'حق التجمع والتنظيم',
    'category.justice': 'الحق في العدالة',
    'country.main_dimensions': 'درجات الأبعاد الرئيسية',
    'country.categories': 'الأداء حسب الفئات',
    'data.title': 'مركز البيانات',
    'data.search': 'ابحث بالدولة أو المنطقة...',
    'data.country': 'الدولة',
    'data.region': 'المنطقة',
    'data.actions': 'إجراءات',
    'data.edit': 'تعديل البيانات',
    'data.no_results': 'لم يتم العثور على دول تطابق البحث.',
    'data.editing': 'تعديل بيانات:',
    'data.saved': 'تم الحفظ',
    'data.error': 'فشل الحفظ',
    'data.cancel': 'إلغاء',
    'data.saving': 'جاري الحفظ...',
    'data.save': 'حفظ التغييرات',
    'data.upload_excel': 'رفع الجداول (Excel)',
    'reports.title': 'مركز تصدير التقارير',
    'reports.subtitle': 'إنشاء تقارير شاملة أو مخصصة لكل دولة حول حقوق الإنسان.',
    'reports.single': 'تقرير لدولة محددة',
    'reports.single_desc': 'إنشاء تحليل مفصل لدولة معينة.',
    'reports.collective': 'تقرير قاري جماعي',
    'reports.collective_desc': 'إنشاء نظرة عامة قارية ومقارنات إقليمية.',
    'reports.select_country': 'اختر دولة...',
    'reports.generate_pdf': 'تصدير PDF',
    'reports.generate_html': 'تصدير HTML',
    'reports.generate_csv': 'تصدير CSV',
    'reports.generate_docx': 'تصدير WORD',
    'reports.generating': 'جاري الإنشاء...',
    'reports.success': 'التقرير جاهز'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
