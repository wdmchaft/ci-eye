package org.netmelody.cieye.core.domain;

import com.google.common.base.Preconditions;

public final class Feature {

    private final String name;
    private final String endpoint;
    private final CiServerType type; 
    
    public Feature(String name, String endpoint, CiServerType type) {
        Preconditions.checkNotNull(name);
        Preconditions.checkNotNull(endpoint);
        Preconditions.checkNotNull(type);
        this.name = name;
        this.endpoint = endpoint;
        this.type = type;
    }
    
    public String name() {
        return name;
    }
    
    public String endpoint() {
        return endpoint;
    }
    
    public CiServerType type() {
        return type;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Feature)) {
            return false;
        }
        
        final Feature other = (Feature)obj;
        return other.name.equals(name) && other.endpoint.equals(endpoint) && other.type.equals(type);
    }
    
    @Override
    public int hashCode() {
        return 17 + name.hashCode() + endpoint.hashCode() * 7;
    }
}
