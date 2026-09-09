const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old collections...');
    await Review.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('admin123', salt);
    const customerHashedPassword = await bcrypt.hash('customer123', salt);

    console.log('👤 Creating Admin and 14 Indian Customers...');
    // 1. Admin User
    await User.create({
      name: 'Admin User',
      email: 'admin@shopnest.com',
      password: adminHashedPassword,
      role: 'admin'
    });

    // 2. 14 Indian Customers
    const customerData = [
      { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', city: 'Bengaluru', street: '14, 4th Cross, Koramangala', postalCode: '560034' },
      { name: 'Priya Patel', email: 'priya.patel@gmail.com', city: 'Ahmedabad', street: 'B-204, Riverfront Residency, Navrangpura', postalCode: '380009' },
      { name: 'Rahul Verma', email: 'rahul.verma@gmail.com', city: 'New Delhi', street: '42, Ring Road, Lajpat Nagar III', postalCode: '110024' },
      { name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', city: 'Chennai', street: '8, Gandhi Mandapam Rd, Kotturpuram', postalCode: '600085' },
      { name: 'Rohan Gupta', email: 'rohan.gupta@gmail.com', city: 'Mumbai', street: 'Flat 601, Sea View Towers, Bandra West', postalCode: '400050' },
      { name: 'Ananya Singh', email: 'ananya.singh@gmail.com', city: 'Lucknow', street: '12-A, Gomti Nagar Bypass', postalCode: '226010' },
      { name: 'Vikram Malhotra', email: 'vikram.malhotra@gmail.com', city: 'Chandigarh', street: 'House 118, Sector 18-C', postalCode: '160018' },
      { name: 'Pooja Nair', email: 'pooja.nair@gmail.com', city: 'Kochi', street: '24/110, Marine Drive Promenade', postalCode: '682031' },
      { name: 'Aditya Joshi', email: 'aditya.joshi@gmail.com', city: 'Pune', street: '302, Green Glen Society, Baner', postalCode: '411045' },
      { name: 'Kavita Reddy', email: 'kavita.reddy@gmail.com', city: 'Hyderabad', street: 'Plot 45, Jubilee Hills Checkpost', postalCode: '500033' },
      { name: 'Amit Kumar', email: 'amit.kumar@gmail.com', city: 'Patna', street: 'Flat 102, Bailey Road Heights', postalCode: '800001' },
      { name: 'Neha Choudhury', email: 'neha.choudhury@gmail.com', city: 'Kolkata', street: '55, Park Street Avenue', postalCode: '700016' },
      { name: 'Deepak Mehta', email: 'deepak.mehta@gmail.com', city: 'Jaipur', street: 'House 7, C-Scheme, Ashok Nagar', postalCode: '302001' },
      { name: 'Ritu Saxena', email: 'ritu.saxena@gmail.com', city: 'Noida', street: 'Tower C-402, Sector 62', postalCode: '201309' }
    ];

    const customers = [];
    for (const c of customerData) {
      const u = await User.create({
        name: c.name,
        email: c.email,
        password: customerHashedPassword,
        role: 'user'
      });
      customers.push({ user: u, ...c });
    }

    console.log('📦 Creating 24 Products across 6 Standard Categories...');
    const productsData = [
      // 1. Electronics
      {
        name: 'boAt Rockerz 550 Wireless Bluetooth Headphones',
        description: '50mm dynamic drivers with physical noise isolation, up to 20 hours playback and plush ear cushions for deep bass clarity.',
        price: 1999,
        category: 'Electronics',
        stock: 18,
        discount: 25,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      },
      {
        name: 'Noise ColorFit Pulse 3 Smart Watch with 1.96" Display',
        description: 'Vibrant HD display, Bluetooth calling, advanced heart rate & SpO2 monitoring with over 100 sports modes and IP68 water resistance.',
        price: 2499,
        category: 'Electronics',
        stock: 25,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
      },
      {
        name: 'Redragon K552 RGB Mechanical Gaming Keyboard',
        description: 'Compact 87-key tenkeyless design with custom mechanical tactile clicky switches, rainbow LED backlighting and metal construction.',
        price: 3299,
        category: 'Electronics',
        stock: 12,
        discount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
      },
      {
        name: 'Mi 4K Ultra HD Android Smart LED TV 43 Inch',
        description: 'Vivid Picture Engine with Dolby Audio, PatchWall with 30+ OTT apps, dual-band Wi-Fi and bezel-less metallic design.',
        price: 26999,
        category: 'Electronics',
        stock: 4, // Low stock indicator
        discount: 0, // No discount
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80'
      },

      // 2. Clothing
      {
        name: "Levi's Men's Slim Fit Washed Denim Trucker Jacket",
        description: 'Classic durable non-stretch cotton denim jacket featuring button-flap chest pockets and point collar for all-season layering.',
        price: 3499,
        category: 'Clothing',
        stock: 15,
        discount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80'
      },
      {
        name: 'Raymond Premium Pure Cotton Solid Casual Shirt',
        description: 'Breathable combed cotton fabric tailored in a contemporary modern fit with spread collar and curved hemline.',
        price: 1799,
        category: 'Clothing',
        stock: 30,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
      },
      {
        name: "Biba Women's Floral Embroidered Anarkali Kurti",
        description: 'Elegant ethnic flared festive kurti adorned with intricate zari and thread embroidery on soft rayon fabric.',
        price: 2999,
        category: 'Clothing',
        stock: 8,
        discount: 30,
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
      },
      {
        name: "Van Heusen Men's Classic Formal Trousers",
        description: 'Wrinkle-resistant poly-viscose blend formal trousers featuring clean flat-front styling and comfortable stretch waistband.',
        price: 1899,
        category: 'Clothing',
        stock: 20,
        discount: 5,
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80'
      },

      // 3. Footwear
      {
        name: 'Nike Revolution 6 Lightweight Running Shoes',
        description: 'Soft foam midsole delivers smooth ride with breathable knit upper, flexible traction outsole and reinforced heel.',
        price: 3695,
        category: 'Footwear',
        stock: 14,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
      },
      {
        name: "Woodland Men's Genuine Leather Casual Loafers",
        description: 'Rugged hand-stitched genuine nubuck leather upper with grooved rubber sole engineered for all-terrain grip and durability.',
        price: 4295,
        category: 'Footwear',
        stock: 7,
        discount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80'
      },
      {
        name: 'Puma Unisex Smashic White Canvas Sneakers',
        description: 'Clean retro court-inspired low-profile sneakers crafted from premium durable canvas with cushioned SoftFoam+ sockliner.',
        price: 2499,
        category: 'Footwear',
        stock: 22,
        discount: 25,
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
      },
      {
        name: 'Bata Orthopedic Arch Support Comfort Slippers',
        description: 'Soft textured footbed designed with orthopedic arch contouring to relieve heel pain and pressure during daily indoor wear.',
        price: 899,
        category: 'Footwear',
        stock: 3, // Low stock indicator
        discount: 0, // No discount
        imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80'
      },

      // 4. Home & Furniture
      {
        name: 'Green Soul Monster Ergonomic High-Back Office Chair',
        description: 'Heavy-duty breathable mesh back with multi-lock synchro mechanism, adjustable 3D armrests and lumbar support cushion.',
        price: 14990,
        category: 'Home & Furniture',
        stock: 6,
        discount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3f25c790100?w=800&q=80'
      },
      {
        name: 'Wakefit Sheesham Solid Wood Center Coffee Table',
        description: 'Handcrafted from 100% natural seasoned Sheesham wood with warm walnut finish and open storage shelf.',
        price: 5499,
        category: 'Home & Furniture',
        stock: 10,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80'
      },
      {
        name: 'Wipro Smart RGB LED Touch Bedside Table Lamp',
        description: '16 million colors with dimmable warm white light, smartphone app control, music sync and voice assistant compatibility.',
        price: 1499,
        category: 'Home & Furniture',
        stock: 28,
        discount: 30,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'
      },
      {
        name: 'SleepyCat Memory Foam Orthopedic Pillow Pair',
        description: 'High-density pressure-relieving memory foam with aloe vera infused washable cover for optimal neck and cervical alignment.',
        price: 1999,
        category: 'Home & Furniture',
        stock: 16,
        discount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80'
      },

      // 5. Beauty & Grooming
      {
        name: 'Minimalist 10% Vitamin C Radiance Face Serum 30ml',
        description: 'Formulated with stabilized ethyl ascorbic acid and Centella water to fade pigmentation, boost collagen and even skin tone.',
        price: 699,
        category: 'Beauty & Grooming',
        stock: 35,
        discount: 5,
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
      },
      {
        name: 'Bombay Shaving Company 6-in-1 Beard Grooming Kit',
        description: 'Complete kit containing cedarwood beard oil, softening beard wash, styling wax, beard comb, scissor and canvas pouch.',
        price: 1299,
        category: 'Beauty & Grooming',
        stock: 18,
        discount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80'
      },
      {
        name: 'Kama Ayurveda Bringadi Intensive Hair Treatment Oil',
        description: 'Traditional Ayurvedic formula with Bhringraj, Amla and Sesame to prevent premature greying, hairfall and dandruff.',
        price: 1650,
        category: 'Beauty & Grooming',
        stock: 9,
        discount: 0, // No discount
        imageUrl: 'https://images.unsplash.com/photo-1608248597359-3a52e935fc76?w=800&q=80'
      },
      {
        name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50',
        description: 'Ultra-lightweight invisible finish with broad spectrum UV protection, PA++++ and blue light defense without any white cast.',
        price: 499,
        category: 'Beauty & Grooming',
        stock: 40,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
      },

      // 6. Sports & Fitness
      {
        name: 'Boldfit Anti-Slip High Density Exercise Yoga Mat 6mm',
        description: 'Eco-friendly TPE non-slip dual-textured mat with alignment lines, carry strap and joint-protecting thick cushioning.',
        price: 999,
        category: 'Sports & Fitness',
        stock: 25,
        discount: 25,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      },
      {
        name: 'Kobo PVC 20 Kg Home Gym Dumbbell & Barbell Set',
        description: 'Versatile adjustable weight plate set with connecting rod to convert into a barbell, star nuts and textured grip handles.',
        price: 1899,
        category: 'Sports & Fitness',
        stock: 5,
        discount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80'
      },
      {
        name: 'Milton Thermosteel Flip Lid Insulated Water Bottle 1L',
        description: 'Double-walled vacuum insulated food-grade stainless steel bottle keeping beverages hot or cold for up to 24 hours.',
        price: 849,
        category: 'Sports & Fitness',
        stock: 30,
        discount: 5,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'
      },
      {
        name: 'Strauss Dual Grip High Resistance Workout Pull-up Bands',
        description: '100% natural latex heavy-duty loop resistance bands for calisthenics assistance, mobility training and strength workouts.',
        price: 649,
        category: 'Sports & Fitness',
        stock: 20,
        discount: 30,
        imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80'
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ ${createdProducts.length} Products inserted.`);

    console.log('🛍️ Generating Orders for Indian Customers...');
    const orderConfigurations = [
      {
        customerIdx: 0,
        prodIdxs: [0], // boAt Headphones
        status: 'Delivered',
        payId: 'pay_Nz8219xKaLmP',
        reviewProdIdx: 0,
        rating: 5,
        comment: 'The bass on these headphones is truly deep and battery lasts 3 whole days of office use!'
      },
      {
        customerIdx: 1,
        prodIdxs: [1], // Noise Smart Watch
        status: 'Delivered',
        payId: 'pay_Ka9018xZaBqR',
        reviewProdIdx: 1,
        rating: 4,
        comment: 'Display is super crisp and bright under sunlight. Bluetooth calling is loud and clear.'
      },
      {
        customerIdx: 2,
        prodIdxs: [4], // Levi's Denim Jacket
        status: 'Delivered',
        payId: 'pay_Mn2901yTqLpW',
        reviewProdIdx: 4,
        rating: 5,
        comment: 'Authentic Levi jacket. Heavyweight denim, looks very stylish over a plain white tee.'
      },
      {
        customerIdx: 3,
        prodIdxs: [6], // Biba Kurti
        status: 'Delivered',
        payId: 'pay_Op8821vBxQaZ',
        reviewProdIdx: 6,
        rating: 5,
        comment: 'Fabric is so soft and breathable. The embroidery looks royal. Fitting was perfect.'
      },
      {
        customerIdx: 4,
        prodIdxs: [8], // Nike Revolution 6
        status: 'Delivered',
        payId: 'pay_Zx7712wKlMnO',
        reviewProdIdx: 8,
        rating: 5,
        comment: 'Lightweight and super bouncy sole for morning jogs. Fits true to size.'
      },
      {
        customerIdx: 5,
        prodIdxs: [16], // Minimalist Serum
        status: 'Delivered',
        payId: 'pay_Qp5512xPqLkM',
        reviewProdIdx: 16,
        rating: 5,
        comment: 'Cleared up my acne marks in 3 weeks. Does not feel sticky on humid days.'
      },
      {
        customerIdx: 6,
        prodIdxs: [12], // Green Soul Chair
        status: 'Delivered',
        payId: 'pay_Rv9934yTrKlQ',
        reviewProdIdx: 12,
        rating: 5,
        comment: 'Essential for work-from-home! Back pain disappeared after a week. Assembly took 20 mins.'
      },
      {
        customerIdx: 7,
        prodIdxs: [22], // Milton Insulated Sipper
        status: 'Delivered',
        payId: 'pay_St6621zNpLmR',
        reviewProdIdx: 22,
        rating: 4,
        comment: 'Water stays chilled for more than 18 hours. Leak-proof flip lid is very convenient.'
      },
      {
        customerIdx: 8,
        prodIdxs: [2], // Redragon Keyboard
        status: 'Delivered',
        payId: 'pay_Wq4412xYvMnP',
        reviewProdIdx: 2,
        rating: 4,
        comment: 'Satisfying mechanical clicks and sturdy aluminum chassis. Great value for gamers.'
      },
      {
        customerIdx: 9,
        prodIdxs: [19], // Derma Co Sunscreen
        status: 'Delivered',
        payId: 'pay_Gh8822vBnPqT',
        reviewProdIdx: 19,
        rating: 5,
        comment: 'Zero white cast! Absorbs like water into the skin. Best daily sunscreen in India.'
      },
      {
        customerIdx: 10,
        prodIdxs: [20], // Boldfit Yoga Mat
        status: 'Shipped',
        payId: 'pay_Lk2233xQwErT',
        reviewProdIdx: null
      },
      {
        customerIdx: 11,
        prodIdxs: [10, 5], // Puma Sneakers + Raymond Shirt
        status: 'Delivered',
        payId: 'pay_Hj7711zXvBnM',
        reviewProdIdx: 10,
        rating: 4,
        comment: 'Clean minimalist look. Soft insole makes it comfortable for full day college wear.'
      },
      {
        customerIdx: 12,
        prodIdxs: [9], // Woodland Loafers
        status: 'Pending',
        payId: 'COD-VERIFIED',
        reviewProdIdx: null
      },
      {
        customerIdx: 13,
        prodIdxs: [15, 14], // SleepyCat Pillows + Wipro Lamp
        status: 'Delivered',
        payId: 'pay_Tr5566uIoPqW',
        reviewProdIdx: 15,
        rating: 5,
        comment: 'Memory foam is neither too hard nor too soft, neck support is just right.'
      },

      // Additional cross-reviews from purchasers
      {
        customerIdx: 0, // Aarav also bought Nike Shoes
        prodIdxs: [8],
        status: 'Delivered',
        payId: 'pay_Zp1199aBvCxF',
        reviewProdIdx: 8,
        rating: 4,
        comment: 'Good grip on tarmac and treadmill. Original Nike product with box intact.'
      },
      {
        customerIdx: 2, // Rahul also bought boAt Headphones
        prodIdxs: [0],
        status: 'Delivered',
        payId: 'pay_Kl8833mNvCqZ',
        reviewProdIdx: 0,
        rating: 4,
        comment: 'Sound is loud and punchy. Cushioning is comfortable even with spectacles on.'
      },
      {
        customerIdx: 4, // Rohan also bought Minimalist Serum
        prodIdxs: [16],
        status: 'Delivered',
        payId: 'pay_Cv4477tYuIoP',
        reviewProdIdx: 16,
        rating: 4,
        comment: 'Effective formulation without any fragrance. Genuine product from ShopNest.'
      },
      {
        customerIdx: 7, // Pooja also bought Raymond Casual Shirt
        prodIdxs: [5],
        status: 'Delivered',
        payId: 'pay_Yx9911mZaQeR',
        reviewProdIdx: 5,
        rating: 5,
        comment: 'Gifted this shirt to my brother. Stitching and fabric quality is pure Raymond standard.'
      },
      {
        customerIdx: 8, // Aditya also bought Wakefit Coffee Table
        prodIdxs: [13],
        status: 'Delivered',
        payId: 'pay_Bn2288qWeRtY',
        reviewProdIdx: 13,
        rating: 5,
        comment: 'Real Sheesham wood with gorgeous grains. Sturdy and elevated our living room look!'
      }
    ];

    for (const config of orderConfigurations) {
      const c = customers[config.customerIdx];
      const items = config.prodIdxs.map(pIdx => {
        const prod = createdProducts[pIdx];
        return {
          productId: prod._id,
          qty: 1,
          price: prod.price
        };
      });

      const totalAmount = items.reduce((acc, it) => acc + it.price, 0);

      await Order.create({
        userId: c.user._id,
        items,
        totalAmount,
        address: {
          fullName: c.name,
          street: c.street,
          city: c.city,
          postalCode: c.postalCode,
          country: 'India'
        },
        paymentId: config.payId,
        status: config.status
      });

      // If review is attached
      if (config.reviewProdIdx !== null && config.rating) {
        const prod = createdProducts[config.reviewProdIdx];
        await Review.create({
          productId: prod._id,
          userId: c.user._id,
          name: c.name,
          rating: config.rating,
          comment: config.comment
        });
      }
    }

    console.log('⭐ Recalculating Ratings and Review Counts for Products in MongoDB...');
    for (const prod of createdProducts) {
      const prodReviews = await Review.find({ productId: prod._id });
      if (prodReviews.length > 0) {
        prod.numReviews = prodReviews.length;
        prod.ratings = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      } else {
        prod.numReviews = 0;
        prod.ratings = 0;
      }
      await prod.save();
    }

    console.log('=============================================');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log(`- 1 Admin: admin@shopnest.com (Password: admin123)`);
    console.log(`- 14 Indian Customers (Password for all: customer123)`);
    console.log(`- 24 Realistic Products across 6 Categories`);
    console.log(`- Realistic Orders with Verified Reviews & Ratings`);
    console.log('=============================================');

    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seedDatabase();
