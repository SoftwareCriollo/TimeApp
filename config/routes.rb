Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    resources :projects, only: :index
  end
#  namespace :api do
    devise_for :mongoid_users,controllers: {
      sessions: "sessions"
    }
    
 # end


end
