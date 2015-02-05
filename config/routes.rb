Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    resources :projects, only: :index do 
      member do
        get :cards
      end
      resources :iterations, only: [:create, :index], shallow: true do
        member do
          resources :timelogs, only: [:create, :index]
        end
      end
    end
  end
  
#  namespace :api do
    devise_for :mongoid_users,controllers: {
      sessions: "sessions"
    }
    
 # end


end
