const config = {
  "ownerID": "136985027413147648",
  permLevels: [
    { level: 0,
      name: "User", 
      check: () => true
    },
    { level: 1,
      name: "Mentor",
      check: (message, member) => {
        try {
          let log = (message.author||member).id == '405109496143282187'
          const mentorRoles = (message||member).settings.roles.mentorRoles.filter(r => (message||member).guild.roles.resolve(r.roleID));
          if(log) console.log(mentorRoles)
          if (mentorRoles){
            let mentorRoleIDs = mentorRoles.map(r => r.roleID)
            if(log) console.log(mentorRoleIDs)
            if(log) console.log((message?message.member:member).roles.cache.some(r => mentorRoleIDs.has(r.id)))
            if((message?message.member:member).roles.cache.some(r => mentorRoleIDs.has(r.id))) return true;
          }
        } catch (e) {
          return false;
        }
      }
    },
    { level: 2,
      name: "Helper", 
      check: (message, member) => {
        try {
          const helperRole = (message||member).guild.roles.resolve((message||member).settings.roles.helper);
          if (helperRole && (message?message.member:member).roles.cache.has(helperRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    { level: 3,
      name: "Moderator", 
      check: (message, member) => {
        try {
          const helperRole = (message||member).guild.roles.resolve((message||member).settings.roles.moderator);
          if (helperRole && (message?message.member:member).roles.cache.has(helperRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    { level: 4,
      name: "Administrator", 
      check: (message, member) => {
        try {
          let hasRoles = (message||member).settings.roles
          if(!hasRoles && (message?message.member:member).hasPermission('MANAGE_GUILD')) return true;
          const adminRole = (message||member).guild.roles.resolve((message||member).settings.roles.admin);
          if (adminRole && (message?message.member:member).roles.cache.has(adminRole.id)) return true;
          else if (!adminRole && (message?message.member:member).hasPermission('MANAGE_GUILD')) return true;
        } catch (e) {
          return false;
        }
      }
    },
    { level: 5,
      name: "Server Owner", 
      check: (message, member) => (message?message.channel.type === "text":member) ? ((message||member).guild.ownerID === (message?message.author:member).id) : false
    },
    { level: 10,
      name: "Bot Owner", 
      check: (message, member) => config.ownerID === (message?message.author:member).id
    }
  ]
};

module.exports = config;
