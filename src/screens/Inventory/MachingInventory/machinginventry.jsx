import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  noDataText: {
    fontSize: wp('4.5%'),
    color: '#666',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0389ca',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  // Lead Card Styling
  leadCard: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    margin: wp('3%'),
    marginBottom: hp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leadRowContainer: {
    width: '100%',
  },
  leadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  leadFieldContainer: {
    flex: 1,
    marginHorizontal: wp('1%'),
    padding: wp('3%'),
    backgroundColor: '#f8f9fa',
    borderRadius: wp('2%'),
    minHeight: hp('8%'),
    justifyContent: 'center',
  },
  leadLabel: {
    fontSize: wp('3.2%'),
    color: '#666',
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  leadValue: {
    fontSize: wp('3.8%'),
    color: '#333',
    fontWeight: '600',
  },
  // Scrollable Cards Container
  scrollableCardsContainer: {
    flex: 1, // Takes remaining space
  },
  // Cards Container
  cardsContainer: {
    padding: 10,
    paddingTop: 2,
  },
  card: {
    backgroundColor: '#2D87DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: '#f0f0f0',
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardId: {
    fontSize: 12,
    color: '#fff',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2ff00ff',
    textAlign: 'right',
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 14,
    color: '#fff',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressContainer: {
    marginTop: -8,
    height: 20,
    justifyContent: 'center',
  },

  progressBackground: {
    width: '100%',
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },

  progressFill: {
    height: 3,
   // backgroundColor: 'black',
    borderRadius: 10,
  },

  floatingPercent: {
    position: 'absolute',
    top: -10,
    transform: [{translateX: -12}], // center text at the end
    fontSize: 12,
    fontWeight: 'bold',
   // color: 'black',
  },
});
