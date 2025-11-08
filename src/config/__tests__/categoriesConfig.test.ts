/**
 * Categories Config Test
 * カテゴリ設定のテスト
 */

import {
  categories,
  getCategoryById,
  getCategoriesByLevel,
  getChildCategories,
  flattenCategories,
  getCategoryPath,
  getLargeCategories,
  getMediumCategories,
  getSmallCategories,
} from '../categoriesConfig';

describe('categoriesConfig', () => {
  describe('categories data structure', () => {
    it('should have large categories', () => {
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((cat) => {
        expect(cat.level).toBe('large');
      });
    });

    it('should have hierarchical structure', () => {
      const stationery = categories.find((c) => c.id === 'stationery');
      expect(stationery).toBeDefined();
      expect(stationery?.children).toBeDefined();
      expect(stationery?.children?.length).toBeGreaterThan(0);
    });
  });

  describe('getCategoryById', () => {
    it('should get large category by id', () => {
      const result = getCategoryById('stationery');
      expect(result).toBeDefined();
      expect(result?.name).toBe('文具・事務用品');
      expect(result?.level).toBe('large');
    });

    it('should get medium category by id', () => {
      const result = getCategoryById('writing-instruments');
      expect(result).toBeDefined();
      expect(result?.name).toBe('筆記用具');
      expect(result?.level).toBe('medium');
    });

    it('should get small category by id', () => {
      const result = getCategoryById('ballpoint-pens');
      expect(result).toBeDefined();
      expect(result?.name).toBe('ボールペン');
      expect(result?.level).toBe('small');
    });

    it('should return undefined for non-existent id', () => {
      const result = getCategoryById('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getCategoriesByLevel', () => {
    it('should get all large categories', () => {
      const result = getCategoriesByLevel('large');
      expect(result.length).toBe(4); // 文具、家具、電化製品、収納用品
      result.forEach((cat) => {
        expect(cat.level).toBe('large');
      });
    });

    it('should get all medium categories', () => {
      const result = getCategoriesByLevel('medium');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((cat) => {
        expect(cat.level).toBe('medium');
      });
    });

    it('should get all small categories', () => {
      const result = getCategoriesByLevel('small');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((cat) => {
        expect(cat.level).toBe('small');
      });
    });
  });

  describe('getChildCategories', () => {
    it('should get children of large category', () => {
      const result = getChildCategories('stationery');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((cat) => {
        expect(cat.parentId).toBe('stationery');
        expect(cat.level).toBe('medium');
      });
    });

    it('should get children of medium category', () => {
      const result = getChildCategories('writing-instruments');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((cat) => {
        expect(cat.parentId).toBe('writing-instruments');
        expect(cat.level).toBe('small');
      });
    });

    it('should return empty array for non-existent parent', () => {
      const result = getChildCategories('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('flattenCategories', () => {
    it('should flatten all categories', () => {
      const result = flattenCategories();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include path information', () => {
      const result = flattenCategories();
      const ballpointPens = result.find((c) => c.id === 'ballpoint-pens');
      expect(ballpointPens).toBeDefined();
      expect(ballpointPens?.path).toEqual(['文具・事務用品', '筆記用具', 'ボールペン']);
      expect(ballpointPens?.fullPath).toBe('文具・事務用品 > 筆記用具 > ボールペン');
    });
  });

  describe('getCategoryPath', () => {
    it('should get full path for small category', () => {
      const result = getCategoryPath('ballpoint-pens');
      expect(result).toBe('文具・事務用品 > 筆記用具 > ボールペン');
    });

    it('should get full path for medium category', () => {
      const result = getCategoryPath('writing-instruments');
      expect(result).toBe('文具・事務用品 > 筆記用具');
    });

    it('should get full path for large category', () => {
      const result = getCategoryPath('stationery');
      expect(result).toBe('文具・事務用品');
    });

    it('should return empty string for non-existent category', () => {
      const result = getCategoryPath('non-existent');
      expect(result).toBe('');
    });
  });

  describe('getLargeCategories', () => {
    it('should return all large categories', () => {
      const result = getLargeCategories();
      expect(result.length).toBe(4);
      result.forEach((cat) => {
        expect(cat.level).toBe('large');
      });
    });
  });

  describe('getMediumCategories', () => {
    it('should return medium categories for large category', () => {
      const result = getMediumCategories('stationery');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((cat) => {
        expect(cat.level).toBe('medium');
        expect(cat.parentId).toBe('stationery');
      });
    });

    it('should return empty array for non-existent large category', () => {
      const result = getMediumCategories('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('getSmallCategories', () => {
    it('should return small categories for medium category', () => {
      const result = getSmallCategories('writing-instruments');
      expect(result.length).toBeGreaterThan(0);
      result.forEach((cat) => {
        expect(cat.level).toBe('small');
        expect(cat.parentId).toBe('writing-instruments');
      });
    });

    it('should return empty array for non-existent medium category', () => {
      const result = getSmallCategories('non-existent');
      expect(result).toEqual([]);
    });
  });
});
