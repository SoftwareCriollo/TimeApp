FactoryGirl.define do
  factory :user do
    sequence(:email) {|n| "user-#{n}@softwarecriollo.com" }
    password  "password"
    factory :apprentice do
      email "rafael@softwarecriollo.com"
      factor_time 1/3
    end
  end

end
