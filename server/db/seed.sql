-- Shanti Pickles & Foods — Seed Data

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, image_url) VALUES
('Pickles', 'pickles', 'Authentic Telugu pickles made with traditional recipes and sun-cured ingredients', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800'),
('Snacks', 'snacks', 'Crispy handmade snacks perfect for tea-time and celebrations', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800'),
('Powders', 'powders', 'Freshly ground spice powders and podi for everyday cooking', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800'),
('Chutneys', 'chutneys', 'Ready-to-eat chutneys and pastes with bold South Indian flavors', 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=800'),
('Combos', 'combos', 'Value packs and gift sets — perfect for gifting or stocking up', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800');

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (name, telugu_name, slug, description, price_250g, price_500g, price_1kg, category_id, spice_level, image_url, tags, rating, review_count) VALUES

-- Pickles
('Avakaya Mango Pickle', 'ఆవకాయ', 'avakaya-mango-pickle',
 'The king of Telugu pickles. Raw mango pieces marinated in mustard powder, Guntur red chilli, and cold-pressed sesame oil. Sun-cured for 3 days for that authentic tangy-spicy kick. No vinegar, no preservatives.',
 249.00, 449.00, 849.00, 1, 'hot',
 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=800',
 '["bestseller", "no-vinegar", "sun-cured", "vegetarian"]', 4.9, 127),

('Gongura Pickle', 'గొంగూర పచ్చడి', 'gongura-pickle',
 'Andhra classic made with fresh sorrel leaves (gongura), tempered with mustard and fenugreek seeds. A tangy, slightly sour pickle that pairs beautifully with hot rice and ghee.',
 269.00, 489.00, 899.00, 1, 'medium',
 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800',
 '["andhra-classic", "cold-pressed-oil", "vegetarian"]', 4.8, 98),

('Lemon Pickle', 'నిమ్మకాయ పచ్చడి', 'lemon-pickle',
 'Whole lemons sun-cured with rock salt, turmeric, and a hint of fenugreek. Zesty, tangy, and perfect as a side with any South Indian meal. Matures beautifully over weeks.',
 239.00, 429.00, 799.00, 1, 'mild',
 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800',
 '["sun-cured", "tangy", "mild", "vegetarian"]', 4.7, 85),

('Tomato Pickle', 'టమాట పచ్చడి', 'tomato-pickle',
 'Ripe tomatoes cooked down with garlic, red chilli, and mustard in cold-pressed oil. A family favorite with a slightly sweet and spicy taste. Available with or without garlic.',
 229.00, 409.00, 749.00, 1, 'medium',
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
 '["family-favorite", "garlic-option", "vegetarian"]', 4.6, 73),

('Garlic Pickle', 'వెల్లుల్లి పచ్చడి', 'garlic-pickle',
 'Whole garlic cloves marinated in a fiery blend of red chilli, tamarind, and sesame oil. Bold, pungent, and deeply satisfying. Known for its immune-boosting properties.',
 279.00, 509.00, 949.00, 1, 'extra_hot',
 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=800',
 '["immune-boost", "extra-spicy", "vegetarian"]', 4.8, 64),

('Mixed Vegetable Pickle', 'కూరగాయల పచ్చడి', 'mixed-vegetable-pickle',
 'A medley of carrots, raw mango, green chillies, and ginger in a mustard-fenugreek masala. Crunchy, colorful, and bursting with flavor. Great for those who love variety.',
 259.00, 469.00, 869.00, 1, 'medium',
 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=800',
 '["crunchy", "colorful", "variety", "vegetarian"]', 4.5, 52),

-- Snacks
('Andhra Mixture', NULL, 'andhra-mixture',
 'Crispy, spicy mixture made with besan sev, peanuts, curry leaves, and a secret spice blend. Roasted to perfection — the ultimate tea-time companion.',
 199.00, 359.00, 669.00, 2, 'hot',
 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800',
 '["crispy", "tea-time", "roasted", "vegetarian"]', 4.7, 91),

('Murukku / Chakli', NULL, 'murukku-chakli',
 'Spiral-shaped crispy snack made with rice flour and urad dal flour, seasoned with cumin and sesame. Light, crunchy, and addictively good. Handmade in small batches.',
 189.00, 339.00, 629.00, 2, 'mild',
 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800',
 '["handmade", "crispy", "light", "vegetarian"]', 4.6, 78),

('Banana Chips', NULL, 'banana-chips',
 'Thin-sliced raw bananas deep-fried in coconut oil with a pinch of salt and turmeric. Perfectly crispy with a natural sweetness. Kerala-style, made fresh.',
 179.00, 319.00, 589.00, 2, 'mild',
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
 '["kerala-style", "coconut-oil", "crispy", "vegetarian"]', 4.5, 45),

-- Powders
('Kandi Podi', 'కంది పొడి', 'kandi-podi',
 'Roasted toor dal powder tempered with red chillies, garlic, and curry leaves. Mix with rice and ghee for the simplest, most satisfying meal. A Telugu kitchen staple.',
 149.00, 269.00, 499.00, 3, 'medium',
 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
 '["staple", "dal-powder", "everyday", "vegetarian"]', 4.8, 112),

('Idli Karam Podi', 'ఇడ్లీ కారం', 'idli-karam-podi',
 'Coarsely ground red chilli and urad dal powder. The perfect accompaniment for idli, dosa, and even bread. Add sesame oil and you have breakfast sorted.',
 139.00, 249.00, 459.00, 3, 'hot',
 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
 '["breakfast", "versatile", "coarse-ground", "vegetarian"]', 4.7, 96),

('Curry Leaf Powder', 'కరివేపాకు పొడి', 'curry-leaf-powder',
 'Sun-dried curry leaves ground with roasted chana dal, red chillies, and a touch of asafoetida. Aromatic, nutritious, and packed with iron. Mix with hot rice for instant flavor.',
 159.00, 289.00, 529.00, 3, 'mild',
 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
 '["nutritious", "iron-rich", "aromatic", "vegetarian"]', 4.6, 67),

-- Chutneys
('Ginger Chutney', 'అల్లం పచ్చడి', 'ginger-chutney',
 'Fresh ginger cooked with tamarind, jaggery, and red chillies. A sweet-sour-spicy relish that adds zing to any meal. Store in the fridge for up to 2 months.',
 199.00, 359.00, NULL, 4, 'medium',
 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=800',
 '["sweet-sour", "relish", "fresh", "vegetarian"]', 4.5, 38),

('Coconut Chutney Powder', 'కొబ్బరి పచ్చడి పొడి', 'coconut-chutney-powder',
 'Dry coconut chutney powder with roasted chana dal and red chillies. Just add water for instant chutney, or sprinkle over idli/dosa for extra crunch. Travel-friendly!',
 169.00, 299.00, 549.00, 4, 'mild',
 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=800',
 '["instant", "travel-friendly", "versatile", "vegetarian"]', 4.4, 29),

-- Combos
('Pickle Trio Box', NULL, 'pickle-trio-box',
 'A curated gift box with 3 bestselling pickles: Avakaya, Gongura, and Lemon. Each jar is 250g. Perfect for gifting or trying our range. Beautifully packed in a craft box.',
 699.00, NULL, NULL, 5, 'medium',
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
 '["gift-box", "trio", "bestsellers", "vegetarian"]', 4.9, 34);

-- ============================================
-- DEMO USER (password: demo1234)
-- ============================================
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Demo User', 'demo@shantipickles.com', '$2a$10$xPPTfLdOQsXVNpN1.dT6Vu8Xt.WJkVRf.DfyF.PvRvqFXcGb2Jiy', '9876543210', 'customer'),
('Admin', 'admin@shantipickles.com', '$2a$10$xPPTfLdOQsXVNpN1.dT6Vu8Xt.WJkVRf.DfyF.PvRvqFXcGb2Jiy', '9876543211', 'admin');

-- Demo address for the demo user
INSERT INTO addresses (user_id, label, name, phone, address_line1, address_line2, city, state, pincode, is_default) VALUES
(1, 'Home', 'Demo User', '9876543210', '42, Jubilee Hills', 'Road No. 5, Near KBR Park', 'Hyderabad', 'Telangana', '500033', TRUE);
