/**
 * 产品搜索功能
 */
(function() {
  'use strict';

  // 产品数据库
  const products = [
    {
      id: 'vam',
      name: 'VAM (Vinyl Acetate Monomer)',
      category: 'Organic Chemical',
      description: 'Vinyl Acetate Monomer is a key raw material for producing VAE emulsion, PVA, and other chemical products. Widely used in adhesives, coatings, and textile industries.',
      keywords: ['VAM', 'Vinyl Acetate Monomer', 'organic chemical', 'adhesives', 'coatings', 'textile']
    },
    {
      id: 'vae',
      name: 'VAE Emulsion',
      category: 'Organic Chemical',
      description: 'Water-based emulsion polymer with excellent adhesion, flexibility, and environmental friendliness. Ideal for adhesives, coatings, and construction materials.',
      keywords: ['VAE', 'Emulsion', 'water-based', 'adhesives', 'coatings', 'construction']
    },
    {
      id: 'pva',
      name: 'PVA (Polyvinyl Alcohol)',
      category: 'Synthetic Resin',
      description: 'Water-soluble synthetic polymer with excellent film-forming properties. Used in textiles, paper, adhesives, and packaging industries.',
      keywords: ['PVA', 'Polyvinyl Alcohol', 'synthetic resin', 'textiles', 'paper', 'packaging']
    },
    {
      id: 'sebs',
      name: 'SEBS (Styrene-Ethylene-Butylene-Styrene)',
      category: 'Synthetic Rubber',
      description: 'Thermoplastic elastomer with excellent weather resistance and aging properties. Used in automotive parts, consumer goods, and medical devices.',
      keywords: ['SEBS', 'Styrene-Ethylene-Butylene-Styrene', 'synthetic rubber', 'elastomer', 'automotive', 'medical']
    },
    {
      id: 'sbs',
      name: 'SBS (Styrene-Butadiene-Styrene)',
      category: 'Synthetic Rubber',
      description: 'Thermoplastic elastomer with excellent elasticity and impact resistance. Widely used in footwear, asphalt modification, and adhesives.',
      keywords: ['SBS', 'Styrene-Butadiene-Styrene', 'synthetic rubber', 'elastomer', 'footwear', 'asphalt']
    },
    {
      id: 'epoxy',
      name: 'Epoxy Resin',
      category: 'Epoxy Resin',
      description: 'High-performance thermosetting resin with excellent mechanical strength and chemical resistance. Used in coatings, composites, and wind power applications.',
      keywords: ['Epoxy', 'Resin', 'thermosetting', 'coatings', 'composites', 'wind power']
    },
    {
      id: 'polyol',
      name: 'Polyether Polyol',
      category: 'Polyether Polyol',
      description: 'Key raw material for polyurethane production. Available for flexible foam, rigid foam, elastomers, and coatings applications.',
      keywords: ['Polyether', 'Polyol', 'polyurethane', 'foam', 'elastomers', 'coatings']
    },
    {
      id: 'fiber',
      name: 'Synthetic Fiber (PVA Fiber)',
      category: 'Synthetic Fiber',
      description: 'High-performance water-soluble and high-tenacity PVA fibers. Used in textiles, construction, and specialty applications.',
      keywords: ['Synthetic Fiber', 'PVA Fiber', 'water-soluble', 'textiles', 'construction']
    }
  ];

  // 搜索函数
  function searchProducts(query) {
    if (!query || query.trim() === '') {
      return products;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = [];

    products.forEach(product => {
      // 搜索产品名称
      if (product.name.toLowerCase().includes(searchTerm)) {
        results.push({ ...product, matchScore: 10 });
        return;
      }

      // 搜索分类
      if (product.category.toLowerCase().includes(searchTerm)) {
        results.push({ ...product, matchScore: 8 });
        return;
      }

      // 搜索描述
      if (product.description.toLowerCase().includes(searchTerm)) {
        results.push({ ...product, matchScore: 6 });
        return;
      }

      // 搜索关键词
      const keywordMatch = product.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      if (keywordMatch) {
        results.push({ ...product, matchScore: 5 });
        return;
      }

      // 部分匹配
      const words = searchTerm.split(/\s+/);
      let matchCount = 0;
      words.forEach(word => {
        if (product.name.toLowerCase().includes(word) ||
            product.description.toLowerCase().includes(word) ||
            product.keywords.some(k => k.toLowerCase().includes(word))) {
          matchCount++;
        }
      });
      if (matchCount > 0) {
        results.push({ ...product, matchScore: matchCount });
      }
    });

    // 按匹配分数排序
    results.sort((a, b) => b.matchScore - a.matchScore);

    // 去重
    const uniqueResults = [];
    const seenIds = new Set();
    results.forEach(product => {
      if (!seenIds.has(product.id)) {
        seenIds.add(product.id);
        uniqueResults.push(product);
      }
    });

    return uniqueResults;
  }

  // 获取URL参数
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // 导出到全局
  window.productSearch = {
    search: searchProducts,
    getAllProducts: function() { return products; },
    getProductById: function(id) {
      return products.find(p => p.id === id);
    }
  };

  // 如果在搜索页面，自动执行搜索
  if (window.location.pathname.includes('search.html')) {
    document.addEventListener('DOMContentLoaded', function() {
      const query = getUrlParameter('keys') || '';
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.value = query;
      }
      
      if (query) {
        performSearch(query);
      }
    });
  }

  // 执行搜索并显示结果
  function performSearch(query) {
    const results = searchProducts(query);
    displaySearchResults(results, query);
  }

  // 显示搜索结果
  function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    const resultsCount = document.getElementById('search-results-count');
    
    if (!resultsContainer) return;

    // 更新结果数量
    if (resultsCount) {
      resultsCount.textContent = results.length > 0 
        ? `Found ${results.length} product${results.length > 1 ? 's' : ''} for "${query}"`
        : `No products found for "${query}"`;
    }

    // 清空现有结果
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      const homeLink = window.location.pathname.includes('search.html') 
        ? 'index.html#products' 
        : '../index.html#products';
      resultsContainer.innerHTML = `
        <div class="no-results">
          <p>No products found matching your search.</p>
          <p>Try searching with different keywords or browse our <a href="${homeLink}">product categories</a>.</p>
        </div>
      `;
      return;
    }

    // 显示搜索结果
    results.forEach(product => {
      const productCard = document.createElement('li');
      productCard.className = 'product-card';
      const imagePath = window.location.pathname.includes('search.html') 
        ? 'static/picture/products/product-' 
        : '../static/picture/products/product-';
      const placeholderPath = window.location.pathname.includes('search.html')
        ? 'static/picture/placeholder.png'
        : '../static/picture/placeholder.png';
      const detailPath = window.location.pathname.includes('search.html')
        ? 'products/detail.html?product='
        : '../products/detail.html?product=';
      
      productCard.innerHTML = `
        <div class="box">
          <a aria-label="${product.name}" class="pic" href="${detailPath}${product.id}">
            <img src="${imagePath}${product.id}.jpg" alt="${product.name}" width="500" height="500" onerror="this.src='${placeholderPath}'">
          </a>
          <h6>
            <a aria-label="${product.name}" href="${detailPath}${product.id}">${product.name}</a>
          </h6>
          <p class="product-category">${product.category}</p>
          <p class="product-desc">${product.description}</p>
        </div>
      `;
      resultsContainer.appendChild(productCard);
    });
  }

  // 导出performSearch函数
  window.performSearch = performSearch;
})();

