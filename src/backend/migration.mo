import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldVlogCategory = {
    #vlog;
    #promo;
    #trading;
  };

  type OldVlogPost = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    createdAt : Int;
    category : OldVlogCategory;
  };

  type OldAnnouncement = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
  };

  type OldActor = {
    vlogPosts : Map.Map<Nat, OldVlogPost>;
    announcements : Map.Map<Nat, OldAnnouncement>;
    nextVlogId : Nat;
    nextAnnouncementId : Nat;
    // Persistent state - not yet used
  };

  type NewVlogCategory = {
    #vlog;
    #promo;
    #trading;
  };

  type NewVlogPost = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    createdAt : Int;
    category : NewVlogCategory;
  };

  type NewAnnouncement = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
  };

  type NewAd = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    linkUrl : Text;
    isActive : Bool;
    createdAt : Int;
  };

  type NewUserAccount = {
    username : Text;
    passwordHash : Blob;
    balance : Nat;
    totalEarned : Nat;
    totalDeposited : Nat;
  };

  type NewDepositRequest = {
    id : Nat;
    userId : Principal;
    username : Text;
    currency : Text;
    amount : Text;
    txHash : Text;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
    reviewedAt : Int;
  };

  type NewWithdrawalRequest = {
    id : Nat;
    userId : Principal;
    username : Text;
    amount : Nat;
    currency : Text;
    walletAddress : Text;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
    reviewedAt : Int;
  };

  type NewEarnRecord = {
    id : Nat;
    userId : Principal;
    username : Text;
    taskType : { #watchVideo; #writeArticle };
    contentId : Text;
    amount : Nat;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
  };

  type NewActor = {
    vlogPosts : Map.Map<Nat, NewVlogPost>;
    nextVlogId : Nat;
    announcements : Map.Map<Nat, NewAnnouncement>;
    nextAnnouncementId : Nat;
    ads : Map.Map<Nat, NewAd>;
    nextAdId : Nat;
    userAccounts : Map.Map<Principal, NewUserAccount>;
    depositRequests : Map.Map<Nat, NewDepositRequest>;
    withdrawalRequests : Map.Map<Nat, NewWithdrawalRequest>;
    earnRecords : Map.Map<Nat, NewEarnRecord>;
    nextDepositId : Nat;
    nextWithdrawalId : Nat;
    nextEarnId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let ads = Map.empty<Nat, NewAd>();
    let userAccounts = Map.empty<Principal, NewUserAccount>();
    let depositRequests = Map.empty<Nat, NewDepositRequest>();
    let withdrawalRequests = Map.empty<Nat, NewWithdrawalRequest>();
    let earnRecords = Map.empty<Nat, NewEarnRecord>();

    {
      vlogPosts = old.vlogPosts;
      nextVlogId = old.nextVlogId;
      announcements = old.announcements;
      nextAnnouncementId = old.nextAnnouncementId;
      ads;
      nextAdId = 1;
      userAccounts;
      depositRequests;
      withdrawalRequests;
      earnRecords;
      nextDepositId = 1;
      nextWithdrawalId = 1;
      nextEarnId = 1;
    };
  };
};
