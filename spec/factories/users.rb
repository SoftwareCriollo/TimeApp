FactoryGirl.define do
  factory :user do
    sequence(:email) {|n| "user-#{n}@softwarecriollo.com" }
    password  "password"
    factory :apprentice do
      email "rafael@softwarecriollo.com"
    end
  end

end