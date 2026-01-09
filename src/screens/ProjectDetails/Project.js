import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {_get} from './../../api/apiClient'; // ✅ custom API client

const Projects = ({navigation}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await _get('/projectlist');
      const projectArray = res?.data?.data;
      if (Array.isArray(projectArray)) {
        const formattedProjects = projectArray.map(item => ({
          id: item.id,
          name: item.title,
          image: item.banner_url,
          description: item.description || '',
          status: item.status || 'Active',
          created_at: item.created_at || '',
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('❌ Error fetching project list:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const navigateToProjectDetails = (projectId) => {
    navigation.navigate('ProjectDetails', {id: projectId});
  };

  const renderProjectCard = ({item}) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => navigateToProjectDetails(item.id)}
      activeOpacity={0.8}>
      <Image
        source={{uri: item.image}}
        style={styles.projectImage}
        resizeMode="cover"
      />
      <View style={styles.projectInfo}>
        <Text style={styles.projectName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.description ? (
          <Text style={styles.projectDescription} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.projectFooter}>
          <Text style={styles.projectStatus}>{item.status}</Text>
          {item.created_at ? (
            <Text style={styles.projectDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProjectShimmer = () => (
    <View style={styles.projectCard}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.projectImage}
      />
      <View style={styles.projectInfo}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.projectNameShimmer}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.projectDescriptionShimmer}
        />
        <View style={styles.projectFooter}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={styles.projectStatusShimmer}
          />
        </View>
      </View>
    </View>
  );

  const renderHorizontalProjects = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalContainer}
      contentContainerStyle={{paddingHorizontal: wp('2%')}}>
      {loading
        ? [...Array(3)].map((_, index) => (
            <View key={index} style={styles.horizontalProjectCard}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.horizontalProjectImage}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.horizontalProjectNameShimmer}
              />
            </View>
          ))
        : projects.map(project => (
            <TouchableOpacity
              key={project.id}
              style={styles.horizontalProjectCard}
              onPress={() => navigateToProjectDetails(project.id)}
              activeOpacity={0.8}>
              <Image
                source={{uri: project.image}}
                style={styles.horizontalProjectImage}
                resizeMode="cover"
              />
              <Text style={styles.horizontalProjectName} numberOfLines={2}>
                {project.name}
              </Text>
            </TouchableOpacity>
          ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Projects We Do</Text>
        <Text style={styles.headerSubtitle}>
          {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
        </Text>
      </View>

      {/* Horizontal Scroll View (compact version) */}
      <View style={styles.horizontalSection}>
        <Text style={styles.sectionTitle}>Featured Projects</Text>
        {renderHorizontalProjects()}
      </View>

      {/* Full Project List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>All Projects</Text>
        {loading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {[...Array(5)].map((_, index) => (
              <View key={index}>{renderProjectShimmer()}</View>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProjectCard}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>🔍 No projects found</Text>
                <Text style={styles.emptySubtext}>
                  Pull down to refresh or check back later
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('0.5%'),
  },
  
  // Horizontal Section Styles
  horizontalSection: {
    backgroundColor: '#fff',
    marginTop: hp('1%'),
    paddingVertical: hp('2%'),
  },
  horizontalContainer: {
    marginTop: hp('1%'),
  },
  horizontalProjectCard: {
    width: wp('35%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    marginRight: wp('3%'),
    padding: wp('2%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalProjectImage: {
    width: '100%',
    height: hp('10%'),
    borderRadius: wp('2%'),
  },
  horizontalProjectName: {
    marginTop: hp('1%'),
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  horizontalProjectNameShimmer: {
    width: wp('28%'),
    height: hp('2%'),
    borderRadius: wp('1%'),
    marginTop: hp('1%'),
  },

  // List Section Styles
  listSection: {
    flex: 1,
    marginTop: hp('1%'),
    backgroundColor: '#fff',
    paddingTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginHorizontal: wp('4%'),
    marginBottom: hp('1%'),
  },
  listContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
  
  // Project Card Styles
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: hp('20%'),
  },
  projectInfo: {
    padding: wp('4%'),
  },
  projectName: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  projectDescription: {
    fontSize: wp('3.2%'),
    color: '#666',
    lineHeight: wp('4.5%'),
    marginBottom: hp('1.5%'),
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStatus: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#28a745',
    backgroundColor: '#d4edda',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1%'),
  },
  projectDate: {
    fontSize: wp('3%'),
    color: '#999',
  },

  // Shimmer Styles
  projectNameShimmer: {
    width: wp('60%'),
    height: hp('2.5%'),
    borderRadius: wp('1%'),
    marginBottom: hp('1%'),
  },
  projectDescriptionShimmer: {
    width: '100%',
    height: hp('6%'),
    borderRadius: wp('1%'),
    marginBottom: hp('1.5%'),
  },
  projectStatusShimmer: {
    width: wp('20%'),
    height: hp('2%'),
    borderRadius: wp('1%'),
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#666',
    marginBottom: hp('1%'),
  },
  emptySubtext: {
    fontSize: wp('3.2%'),
    color: '#999',
    textAlign: 'center',
  },
});