// إعدادات الاتصال الآمن والمجاني بـ Supabase لمتجر تولين
const SUPABASE_URL = "https://dlxhdakozhmdvuheizpu.supabase.co";
const SUPABASE_ANON_KEY = "Sb_publishable_uXigsty0Sqih9oRFm0jCgw_2Hxs3jx3";

const allProducts = [];

// دالة جلب البيانات الحية من قاعدة البيانات
async function fetchGifts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        const data = await response.json();
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) loadingDiv.style.display = 'none';

        if (data && data.length > 0) {
            allProducts.length = 0;
            data.forEach(item => allProducts.push(item));
            renderProducts(allProducts);
        } else {
            document.getElementById('productsContainer').innerHTML = "<p style='text-align:center; color:#aaa;'>لا توجد منتجات معروضة حالياً.</p>";
        }
    } catch (error) {
        console.error("خطأ أثناء الاتصال بقاعدة البيانات:", error);
    }
}

// دالة بناء وعرض بطاقات المنتجات في الصفحة
function renderProducts(productsList) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = "";

    productsList.forEach(item => {
        // قراءة الصورة الأولى من المصفوفة الجديدة باحترافية وتوافقية عالية
        const mainImage = Array.isArray(item.image_url) ? item.image_url[0] : item.image_url;
        
        // تجهيز نص رسالة الواتساب التلقائية عند طلب الزبون
        const whatsappMessage = encodeURIComponent(`مرحباً متجر تولين، أريد طلب منتج: ${item.name}\nالسعر: ${item.price} شيكل\nرابط الصورة: ${mainImage}`);
        const whatsappLink = `https://wa.me/970592428544?text=${whatsappMessage}`; // قمنا بتعيين رقمك الافتراضي هنا، يمكنك تعديله

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${mainImage || '33744.jpg'}" alt="${item.name}">
            <div class="product-info">
                <div class="product-title">${item.name}</div>
                <div class="product-price">${item.price} شيكل</div>
                <a href="${whatsappLink}" target="_blank" class="order-btn">اطلب عبر واتساب الآن 📲</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// دالة الفلترة والتصنيفات
function filterCategory(category, button) {
    // تحديث شكل الزر النشط
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    if (category === 'الكل') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// تشغيل الجلب التلقائي فور فتح الزبون للموقع
window.onload = fetchGifts;
