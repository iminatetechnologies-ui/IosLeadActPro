// InventoryListStyles.js
import {StyleSheet} from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#fff',
    padding: rw(3),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {flex: 1},

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2),
  },

  headerTitle: {
    fontSize: rf(1.8),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: rh(0.4),
  },

  headerSubtitle: {
    fontSize: rf(1.5),
    color: '#666',
  },

  filterButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.8),
    borderRadius: rw(1.5),
  },

  filterButtonText: {
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: '600',
  },

  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.8),
    borderRadius: rw(1.5),
  },

  addButtonText: {
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: '600',
  },

  activeFiltersContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(4),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  activeFiltersTitle: {
    fontSize: rf(1.6),
    fontWeight: '600',
    color: '#495057',
    marginBottom: rh(0.8),
  },

  activeFiltersList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2),
  },

  activeFilterChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.6),
    borderRadius: rw(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },

  activeFilterText: {
    color: '#1976d2',
    fontSize: rf(1.4),
    marginRight: rw(1),
    fontWeight: '500',
  },

  removeFilterIcon: {
    color: '#1976d2',
    fontSize: rf(1.3),
    fontWeight: 'bold',
  },

  clearAllButton: {
    backgroundColor: '#f8d7da',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.6),
    borderRadius: rw(4),
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },

  clearAllText: {
    color: '#721c24',
    fontSize: rf(1.4),
    fontWeight: '600',
  },

  scrollView: {flex: 1},

  cardsContainer: {
    padding: rw(4),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: rw(3),
    padding: rw(4),
    marginBottom: rh(2),
    elevation: 10,
    shadowColor: '#2196F3',
    shadowOffset: {width: 3, height: 4},
    shadowOpacity: 1.1,
    shadowRadius: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1),
    paddingBottom: rh(1),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  projectName: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: '#333',
  },

  cardId: {
    fontSize: rf(1.4),
    color: '#666',
  },

  cardPrice: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'right',
  },

  section: {marginBottom: rh(1)},

  sectionLabel: {
    fontSize: rf(1.5),
    fontWeight: '600',
    color: '#666',
    marginBottom: rh(0.5),
  },

  sectionValue: {
    fontSize: rf(1.6),
    color: '#333',
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rw(3),
    marginBottom: rh(1),
  },

  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2196F3',
    padding: rw(2),
    borderRadius: rw(2),
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: rf(1.3),
    color: '#fff',
  },

  detailValue: {
    fontSize: rf(1.6),
    fontWeight: '600',
    color: '#fff',
  },

  additionalInfo: {
    backgroundColor: '#f8f9fa',
    padding: rw(3),
    borderRadius: rw(2),
    marginBottom: rh(1.5),
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(0.4),
  },

  infoLabel: {
    fontSize: rf(1.3),
    color: '#666',
  },

  infoValue: {
    fontSize: rf(1.3),
    color: '#333',
  },

  cardActions: {
    flexDirection: 'row',
    gap: rw(2),
  },

  actionButton: {
    flex: 1,
    paddingVertical: rh(1.2),
    borderRadius: rw(2),
    alignItems: 'center',
  },

 

 

  center: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: rh(2),
  },

  loadingText: {
    marginTop: rh(1),
    fontSize: rf(1.6),
    color: '#666',
  },

  emptyContainer: {
    alignItems: 'center',
    padding: rh(5),
  },

  emptyText: {
    fontSize: rf(2),
    color: '#666',
    marginBottom: rh(1),
  },

  emptySubtext: {
    fontSize: rf(1.6),
    color: '#999',
  },

  clearFiltersButton: {
    backgroundColor: '#2196F3',
    paddingVertical: rh(1),
    paddingHorizontal: rw(5),
    borderRadius: rw(2),
    marginTop: rh(1),
  },

  clearFiltersText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: rf(1.6),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: rw(5),
    borderTopRightRadius: rw(5),
    maxHeight: '85%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: rw(5),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  modalTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    color: '#333',
  },

  modalClose: {
    fontSize: rf(3),
    color: '#666',
  },

  filterForm: {padding: rw(5)},

  filterGroup: {marginBottom: rh(2)},

  filterLabel: {
    fontSize: rf(1.8),
    fontWeight: '600',
    marginBottom: rh(1),
  },

  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rw(2),
  },

  filterOption: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.8),
    borderRadius: rw(5),
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  filterOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },

  filterOptionText: {
    fontSize: rf(1.5),
    color: '#495057',
  },

  filterOptionTextSelected: {
    color: '#fff',
    fontSize: rf(1.6),
  },

  filterInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.2),
    borderRadius: rw(3),
    borderWidth: 1,
    borderColor: '#dee2e6',
    fontSize: rf(1.7),
  },

  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2),
  },

  priceRangeSeparator: {
    fontSize: rf(1.8),
    color: '#666',
  },

  modalActions: {
    flexDirection: 'row',
    gap: rw(3),
    padding: rw(4),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  modalButton: {
    flex: 1,
    paddingVertical: rh(1.2),
    borderRadius: rw(3),
    alignItems: 'center',
  },

  clearButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  clearButtonText: {
    fontSize: rf(1.7),
    color: '#495057',
  },

  applyButton: {backgroundColor: '#2196F3'},

  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: rf(1.7),
  },
});
