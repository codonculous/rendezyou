class User < ApplicationRecord

  has_secure_password

  has_many :bookings
  has_many :tours

  validates :name, :username, :email, :phone, :password, presence: true
  validates :username, :email, :phone, uniqueness: true
  validates :password, length: { in: 4..20 }
  validates :email, format: { with: /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+/i }
  validates :phone, length: { is: 15 }, format: { with: /[\d]+/, message: 'can only contain numbers'}

  def booked_tours
    tours=[]
    bookings.each do |b|
      # byebug
      t = Tour.find( Schedule.find( (b.schedule_id) ).tour_id )
      if !tours.include?(t)
        tours << Tour.find( Schedule.find( (b.schedule_id) ).tour_id )
      end
    end
    return tours

  end

end
