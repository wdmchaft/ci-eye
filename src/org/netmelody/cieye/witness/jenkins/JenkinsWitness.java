package org.netmelody.cieye.witness.jenkins;

import static com.google.common.collect.Collections2.filter;
import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.Collection;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.netmelody.cieye.domain.Feature;
import org.netmelody.cieye.domain.TargetGroup;
import org.netmelody.cieye.persistence.Detective;
import org.netmelody.cieye.witness.Witness;
import org.netmelody.cieye.witness.jenkins.jsondomain.Server;
import org.netmelody.cieye.witness.jenkins.jsondomain.UserDetail;
import org.netmelody.cieye.witness.jenkins.jsondomain.Users;
import org.netmelody.cieye.witness.jenkins.jsondomain.View;

import com.google.common.base.Function;
import com.google.common.base.Predicate;

public final class JenkinsWitness implements Witness {
    
    private static final Log LOG = LogFactory.getLog(JenkinsWitness.class);
    
    private final JenkinsCommunicator communicator;
    private final ViewAnalyser viewAnalsyer;

    public JenkinsWitness(String endpoint, Detective detective) {
        this.communicator = new JenkinsCommunicator(endpoint, "ci", "");
        this.viewAnalsyer = new ViewAnalyser(communicator, detective);
    }

    @Override
    public TargetGroup statusOf(final Feature feature) {
        if (!communicator.endpoint().equals(feature.endpoint())) {
            return new TargetGroup();
        }
        
        final Collection<View> views = filter(views(), new Predicate<View>() {
            @Override public boolean apply(View viewDigest) {
                return viewDigest.name.startsWith(feature.name());
            }
        });
        if (views.isEmpty()) {
            LOG.error("No view named <" + feature.name() + "> found");
            return new TargetGroup();
        }
        
        final View viewDigest = views.iterator().next();
        return new TargetGroup(viewAnalsyer.analyse(viewDigest));
    }
    
    @Override
    public long millisecondsUntilNextUpdate(Feature feature) {
        return 0L;
    }
    
    @Override
    public boolean takeNoteOf(String targetId, String note) {
        final String buildUrl = this.viewAnalsyer.lastBadBuildUrlFor(targetId);
        
        if (null == buildUrl || buildUrl.isEmpty()) {
            return false;
        }
        
        communicator.doJenkinsPost(buildUrl +
                                   "submitDescription?" +
                                   URLEncodedUtils.format(newArrayList(new BasicNameValuePair("description", note)),
                                                          "UTF-8"));
        return true;
    }
    
    public Collection<String> users() {
        final Users detail = communicator.makeJenkinsRestCallWithSuffix("people", Users.class);
        return transform(detail.users, new Function<UserDetail, String>() {
            @Override public String apply(UserDetail userDetail) { return userDetail.user.fullName; }
        });
    }
    
    private Collection<View> views() {
        return communicator.makeJenkinsRestCallWithSuffix("", Server.class).views;
    }

//    private Computer agentDetails(String agentName) {
//        return makeJenkinsRestCall(endpoint + "/computer/" + agentName, Computer.class);
//    }
}
