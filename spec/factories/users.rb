FactoryGirl.define do
  factory :user do
    sequence(:email) {|n| "user-#{n}@softwarecriollo.com" }
    password  "password"
  end

end