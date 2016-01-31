FactoryGirl.define do
  factory :client do
    sequence(:email) {|n| "client-#{n}@client.com" }
    project_id 'ProjectID'
    name 'Client name'
  end
end
