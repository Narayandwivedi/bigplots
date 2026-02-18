import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const getAbsoluteImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

const ShopCategoryManagement = () => {
  const { BACKEND_URL } = useContext(AppContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [replacingImageCategoryId, setReplacingImageCategoryId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: '',
    redirectUrl: '',
    priority: 1,
    isActive: true
  });
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryPreview, setNewCategoryPreview] = useState('');
  const [replaceImageFiles, setReplaceImageFiles] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (newCategoryPreview) {
        URL.revokeObjectURL(newCategoryPreview);
      }
    };
  }, [newCategoryPreview]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/shop-categories/admin`);
      const categoryList = Array.isArray(response.data?.data) ? response.data.data : [];
      setCategories(categoryList);
    } catch (error) {
      alert(`Error fetching shop categories: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageFile = async (file) => {
    if (!file) {
      throw new Error('Please select an icon image');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${BACKEND_URL}/api/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const imageUrl = response.data?.data?.url;
    if (!imageUrl) {
      throw new Error('Image upload failed');
    }

    return imageUrl;
  };

  const resetCreateForm = () => {
    if (newCategoryPreview) {
      URL.revokeObjectURL(newCategoryPreview);
    }

    setNewCategoryImage(null);
    setNewCategoryPreview('');
    setNewCategory({
      name: '',
      redirectUrl: '',
      priority: categories.length + 1,
      isActive: true
    });
  };

  const openAddModal = () => {
    resetCreateForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetCreateForm();
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!newCategory.name.trim()) {
      alert('Please enter category name');
      return;
    }

    if (!newCategoryImage) {
      alert('Please select category icon image');
      return;
    }

    setCreating(true);
    try {
      const imageUrl = await uploadImageFile(newCategoryImage);

      await axios.post(`${BACKEND_URL}/api/shop-categories`, {
        name: newCategory.name.trim(),
        imageUrl,
        redirectUrl: newCategory.redirectUrl.trim(),
        priority: Number(newCategory.priority) || categories.length + 1,
        isActive: Boolean(newCategory.isActive)
      });

      await fetchCategories();
      resetCreateForm();
      setShowAddModal(false);
      alert('Shop category created successfully');
    } catch (error) {
      alert(`Error creating shop category: ${error.response?.data?.message || error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleCategoryFieldChange = (categoryId, field, value) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === categoryId
          ? {
              ...category,
              [field]: value
            }
          : category
      )
    );
  };

  const handleSaveCategory = async (category) => {
    setUpdatingCategoryId(category._id);
    try {
      await axios.put(`${BACKEND_URL}/api/shop-categories/${category._id}`, {
        name: category.name || '',
        redirectUrl: category.redirectUrl || '',
        priority: Number(category.priority) || 1,
        isActive: Boolean(category.isActive)
      });

      await fetchCategories();
      alert('Shop category updated');
    } catch (error) {
      alert(`Error updating shop category: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this shop category?');
    if (!confirmed) return;

    setDeletingCategoryId(categoryId);
    try {
      await axios.delete(`${BACKEND_URL}/api/shop-categories/${categoryId}`);
      await fetchCategories();
      alert('Shop category deleted');
    } catch (error) {
      alert(`Error deleting shop category: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleReorder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) {
      return;
    }

    const reorderedCategories = [...categories];
    [reorderedCategories[index], reorderedCategories[targetIndex]] = [reorderedCategories[targetIndex], reorderedCategories[index]];

    setReordering(true);
    try {
      await axios.patch(`${BACKEND_URL}/api/shop-categories/reorder`, {
        orderedIds: reorderedCategories.map((category) => category._id)
      });

      await fetchCategories();
    } catch (error) {
      alert(`Error reordering shop categories: ${error.response?.data?.message || error.message}`);
    } finally {
      setReordering(false);
    }
  };

  const handleNewImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (newCategoryPreview) {
      URL.revokeObjectURL(newCategoryPreview);
    }

    setNewCategoryImage(file);
    setNewCategoryPreview(URL.createObjectURL(file));
  };

  const handleReplaceImageSelect = (categoryId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setReplaceImageFiles((prev) => ({
      ...prev,
      [categoryId]: file
    }));
  };

  const handleReplaceImage = async (category) => {
    const file = replaceImageFiles[category._id];
    if (!file) {
      alert('Please select a new icon image first');
      return;
    }

    setReplacingImageCategoryId(category._id);
    try {
      const imageUrl = await uploadImageFile(file);

      await axios.put(`${BACKEND_URL}/api/shop-categories/${category._id}`, {
        name: category.name || '',
        redirectUrl: category.redirectUrl || '',
        priority: Number(category.priority) || 1,
        isActive: Boolean(category.isActive),
        imageUrl
      });

      await fetchCategories();
      setReplaceImageFiles((prev) => {
        const next = { ...prev };
        delete next[category._id];
        return next;
      });
      alert('Category icon updated');
    } catch (error) {
      alert(`Error updating category icon: ${error.response?.data?.message || error.message}`);
    } finally {
      setReplacingImageCategoryId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading shop categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shop Category Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload category icons, set click redirect links, and control priority order.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Manage Shop Categories</h2>
          <span className="text-sm text-gray-500">{categories.length} category(s)</span>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories found. Click "+ Add Category" to create one.</div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category._id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                  <div className="lg:col-span-1 space-y-2">
                    <img
                      src={getAbsoluteImageUrl(BACKEND_URL, category.imageUrl)}
                      alt={category.name || `Category ${index + 1}`}
                      className="w-full h-32 object-contain bg-gray-50 border border-gray-200 rounded-md"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleReplaceImageSelect(category._id, event)}
                      className="w-full text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleReplaceImage(category)}
                      disabled={replacingImageCategoryId === category._id}
                      className="w-full px-3 py-2 bg-gray-200 text-gray-800 text-xs rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      {replacingImageCategoryId === category._id ? 'Updating...' : 'Update Icon'}
                    </button>
                  </div>

                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Category Name</label>
                      <input
                        type="text"
                        value={category.name || ''}
                        onChange={(e) => handleCategoryFieldChange(category._id, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Priority</label>
                      <input
                        type="number"
                        min="0"
                        value={category.priority}
                        onChange={(e) => handleCategoryFieldChange(category._id, 'priority', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Redirect Link</label>
                      <input
                        type="text"
                        value={category.redirectUrl || ''}
                        onChange={(e) => handleCategoryFieldChange(category._id, 'redirectUrl', e.target.value)}
                        placeholder="/search?q=fruits or https://example.com"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={Boolean(category.isActive)}
                          onChange={(e) => handleCategoryFieldChange(category._id, 'isActive', e.target.checked)}
                        />
                        Active (show on frontend)
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-1 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveCategory(category)}
                      disabled={updatingCategoryId === category._id}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updatingCategoryId === category._id ? 'Saving...' : 'Save'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(index, -1)}
                      disabled={reordering || index === 0}
                      className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(index, 1)}
                      disabled={reordering || index === categories.length - 1}
                      className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category._id)}
                      disabled={deletingCategoryId === category._id}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingCategoryId === category._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={closeAddModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Shop Category</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500"
              >
                x
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageSelect}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Fruits"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Link</label>
                  <input
                    type="text"
                    value={newCategory.redirectUrl}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, redirectUrl: e.target.value }))}
                    placeholder="/search?q=fruits or https://example.com"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <input
                      type="number"
                      min="0"
                      value={newCategory.priority}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower number shows first.</p>
                  </div>

                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={newCategory.isActive}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Uploading...' : 'Upload Category'}
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-44 flex items-center justify-center">
                {newCategoryPreview ? (
                  <img
                    src={newCategoryPreview}
                    alt="New category preview"
                    className="max-h-56 w-full object-contain rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-500">Image preview will appear here</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCategoryManagement;
