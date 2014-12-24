Rails.application.routes.draw do
  root 'home#index'

#  namespace :api do
    devise_for :mongoid_users,controllers: {
      sessions: "sessions"
    }
    
 # end


end
