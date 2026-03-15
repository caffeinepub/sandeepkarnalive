import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Persistent Data Types
  type VlogCategory = {
    #vlog;
    #promo;
    #trading;
  };

  public type VlogPost = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    createdAt : Int;
    category : VlogCategory;
  };

  public type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module VlogPost {
    public func compare(a : VlogPost, b : VlogPost) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Announcement {
    public func compare(a : Announcement, b : Announcement) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Persistent State
  var nextVlogId = 1;
  var nextAnnouncementId = 1;
  let vlogPosts = Map.empty<Nat, VlogPost>();
  let announcements = Map.empty<Nat, Announcement>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization System
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //----------------- User Profile Management -----------------//

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //----------------- Vlogs CRUD -----------------//

  public shared ({ caller }) func createVlogPost(
    title : Text,
    description : Text,
    videoUrl : Text,
    thumbnailUrl : Text,
    category : VlogCategory,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create vlogs");
    };

    let vlogPost : VlogPost = {
      id = nextVlogId;
      title;
      description;
      videoUrl;
      thumbnailUrl;
      createdAt = Time.now();
      category;
    };

    vlogPosts.add(nextVlogId, vlogPost);
    nextVlogId += 1;
  };

  public shared ({ caller }) func updateVlogPost(
    id : Nat,
    title : Text,
    description : Text,
    videoUrl : Text,
    thumbnailUrl : Text,
    category : VlogCategory,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update vlogs");
    };

    switch (vlogPosts.get(id)) {
      case (null) { Runtime.trap("Vlog post not found") };
      case (?existing) {
        let updated : VlogPost = {
          id;
          title;
          description;
          videoUrl;
          thumbnailUrl;
          createdAt = existing.createdAt;
          category;
        };
        vlogPosts.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteVlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete vlogs");
    };

    if (not vlogPosts.containsKey(id)) {
      Runtime.trap("Vlog post not found");
    };

    vlogPosts.remove(id);
  };

  public query func getVlogPosts() : async [VlogPost] {
    vlogPosts.values().toArray().sort();
  };

  public query func getVlogPost(id : Nat) : async VlogPost {
    switch (vlogPosts.get(id)) {
      case (null) { Runtime.trap("Vlog post not found") };
      case (?post) { post };
    };
  };

  public query func getVlogPostsByCategory(category : VlogCategory) : async [VlogPost] {
    vlogPosts.values().toArray().filter(
      func(post) { post.category == category }
    ).sort();
  };

  //----------------- Announcements CRUD -----------------//

  public shared ({ caller }) func createAnnouncement(
    title : Text,
    content : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };

    let announcement : Announcement = {
      id = nextAnnouncementId;
      title;
      content;
      createdAt = Time.now();
    };

    announcements.add(nextAnnouncementId, announcement);
    nextAnnouncementId += 1;
  };

  public shared ({ caller }) func updateAnnouncement(
    id : Nat,
    title : Text,
    content : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update announcements");
    };

    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?existing) {
        let updated : Announcement = {
          id;
          title;
          content;
          createdAt = existing.createdAt;
        };
        announcements.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };

    if (not announcements.containsKey(id)) {
      Runtime.trap("Announcement not found");
    };

    announcements.remove(id);
  };

  public query func getAnnouncements() : async [Announcement] {
    announcements.values().toArray().sort();
  };

  public query func getAnnouncement(id : Nat) : async Announcement {
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?a) { a };
    };
  };

  //----------------- HTTP Outcalls -----------------//

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func fetchCryptoPrices() : async Text {
    await OutCall.httpGetRequest(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1",
      [],
      transform,
    );
  };

  public shared func fetchWorldNews() : async Text {
    await OutCall.httpGetRequest(
      "https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=20&apikey=demo",
      [],
      transform,
    );
  };
};
